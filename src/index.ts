import { Kafka } from 'kafkajs';

import config from './config';
import logger from './logger';

import { skalMeldingBehandles } from './lib/skal-melding-behandles';

import { MeldekortMelding } from './types/meldekort-melding';
import hentArbeidssokerperioder from './lib/hent-arbeidssokerperioder';
import { kanArbeidssokerenReaktiveres } from './lib/kan-arbeidssokeren-reaktiveres';
import reaktiverBruker from './lib/reaktiver-bruker';
import lagreReaktiveringForBruker from './lib/lagre-reaktivering-for-bruker';
import { FeatureToggles, toggleIsEnabled } from './unleash';

const genererSSLConfig = () => {
    if (!config.KAFKA_CA) {
        return false;
    }
    return {
        rejectUnauthorized: false,
        ca: [config.KAFKA_CA],
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERTIFICATE,
    };
};

const kafka = new Kafka({
    clientId: config.APP_NAME,
    brokers: [config.KAFKA_BROKERS],
    ssl: genererSSLConfig(),
});

const consumer = kafka.consumer({ groupId: `${config.APP_NAME}-group-v1` });

const hentNesteFraKo = () => toggleIsEnabled(FeatureToggles.HENT_NESTE_FRA_KO);

async function runConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: config.KAFKA_TOPIC, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                const { value, offset } = message;
                try {
                    const messageJSON = JSON.parse(value.toString()) as MeldekortMelding;
                    const skalBehandles = skalMeldingBehandles(messageJSON);
                    if (skalBehandles) {
                        logger.info(`Behandler meldingen med offset - ${offset}`);
                        const fnr = messageJSON.fnr;
                        try {
                            if (kanArbeidssokerenReaktiveres(await hentArbeidssokerperioder(fnr))) {
                                await reaktiverBruker(fnr);
                                await lagreReaktiveringForBruker(fnr);
                            }
                        } catch (err) {
                            logger.error(`Feil ved reaktivering av bruker: ${err}`);
                        }
                    } else {
                        logger.info(`Meldingen med offset - ${offset} - skal ikke behandles`);
                    }
                } catch (error) {
                    logger.error(`Feil ved lesing av kafka melding: ${error}`);
                }
            }
        },
    });
}

(async () => {
    if (hentNesteFraKo()) {
        logger.info(`Feature toggle ${FeatureToggles.HENT_NESTE_FRA_KO} er aktivert. Henter nye meldekort`);
        await runConsumer();
    }
})();
