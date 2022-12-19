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

const kafka = new Kafka(config.kafka.config);
const consumer = kafka.consumer(config.kafka.consumer);

async function sjekkHentNesteFraKoToggle() {
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
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

                let messageJSON;
                try {
                    messageJSON = JSON.parse(value.toString()) as MeldekortMelding;
                } catch (error) {
                    logger.error(error, `Feil ved lesing av kafka melding`);
                    return;
                }

                const skalBehandles = skalMeldingBehandles(messageJSON);
                if (!skalBehandles) {
                    logger.info(`Meldingen med offset - ${offset} - skal ikke behandles`);
                    return;
                }

                logger.info(`Behandler meldingen med offset - ${offset}`);

                const { fnr } = messageJSON;

                try {
                    logger.info(`Henter arbeidssokerperioder for bruker - offset ${offset}`);
                    const { arbeidssokerperioder } = await hentArbeidssokerperioder(fnr);
                    if (!arbeidssokerperioder || arbeidssokerperioder.length === 0) {
                        logger.info(`Ingen arbeidssokerperioder funnet - offset ${offset}`);
                        return;
                    }

                    logger.info(`${arbeidssokerperioder.length} arbeidssokerperioder funnet - offset ${offset}`);

                    if (!kanArbeidssokerenReaktiveres(arbeidssokerperioder)) {
                        logger.info(`Bruker kan ikke reaktiveres - offset ${offset}`);
                        return;
                    }

                    logger.info(`Forsøker å reaktivere bruker - offset ${offset}`);
                    await reaktiverBruker(fnr);

                    logger.info(`Forsøker å lagre reaktivering for bruker - offset ${offset}`);
                    await lagreReaktiveringForBruker(fnr);
                } catch (error) {
                    logger.error(error, `Feil ved reaktivering av bruker`);
                }
            }
        },
    });
}

(async () => {
    await unleashInit();
    sjekkHentNesteFraKoToggle();
    runConsumer();
})();
