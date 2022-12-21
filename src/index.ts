import { Kafka } from 'kafkajs';

import config from './config';
import behandleMelding from './lib/behandle-melding';
import { callId, generateCallId } from './lib/call-id-provider';
import logger from './logger';
import { MeldekortMelding } from './types/meldekort-melding';
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
            generateCallId();
            const { value, offset } = message;

            if (!value) {
                logger.error({ callId, message: 'Ingen melding mottatt fra topic' });
                return;
            }

            let meldekortMelding: MeldekortMelding;
            try {
                meldekortMelding = JSON.parse(value.toString());
            } catch (error) {
                const err = error as Error;
                logger.error({ err, callId, message: `Feil ved lesing av kafka melding: ${err.message}` });
                return;
            }

            await behandleMelding(meldekortMelding, offset);
        },
    });
}

(async () => {
    await unleashInit();
    sjekkHentNesteFraKoToggle();
    runConsumer();
})();
