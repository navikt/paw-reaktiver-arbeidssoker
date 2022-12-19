import { Kafka } from 'kafkajs';

import config from './config';
import logger from './logger';

import { skalMeldingBehandles } from './lib/skal-melding-behandles';

import { MeldekortMelding } from './types/meldekort-melding';
import hentArbeidssokerperioder from './lib/hent-arbeidssokerperioder';
import { kanArbeidssokerenReaktiveres } from './lib/kan-arbeidssokeren-reaktiveres';
import reaktiverBruker from './lib/reaktiver-bruker';
import lagreReaktiveringForBruker from './lib/lagre-reaktivering-for-bruker';
import { FeatureToggles, toggleIsEnabled, unleashInit } from './unleash';

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

async function sjekkHentNesteFraKo() {
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const hentNesteFraKo = toggleIsEnabled(FeatureToggles.HENT_NESTE_FRA_KO);
        const consumerPaused = consumer.paused().some(({ topic }) => topic === config.KAFKA_TOPIC);

        if (!hentNesteFraKo && !consumerPaused) {
            logger.info(`Feature toggle ${FeatureToggles.HENT_NESTE_FRA_KO} er deaktivert, pauser consumer`);
            consumer.pause([{ topic: config.KAFKA_TOPIC }]);
        }
        if (hentNesteFraKo && consumerPaused) {
            logger.info(`Feature toggle ${FeatureToggles.HENT_NESTE_FRA_KO} er aktivert, fortsetter consumer`);
            consumer.resume([{ topic: config.KAFKA_TOPIC }]);
        }
    }
}

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
                            logger.info(`Henter arbeidssokerperioder for bruker - offset ${offset}`);
                            const { arbeidssokerperioder } = await hentArbeidssokerperioder(fnr);
                            if (arbeidssokerperioder.length === 0) {
                                logger.info(`Ingen arbeidssokerperioder funnet - offset ${offset}`);
                                return;
                            }
                            if (kanArbeidssokerenReaktiveres(arbeidssokerperioder)) {
                                logger.info(`Forsøker å reaktivere bruker - offset ${offset}`);
                                await reaktiverBruker(fnr);
                                logger.info(`Forsøker å lagre reaktivering for bruker - offset ${offset}`);
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
    await unleashInit();
    sjekkHentNesteFraKo();
    runConsumer();
})();
