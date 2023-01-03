import { Kafka } from 'kafkajs';

import { consumerConfig, kafkaConfig, consumerSubscribeTopics, kafkaTopic } from './config/kafka';
import behandleMelding from './lib/behandle-melding';
import { callId, generateCallId } from './lib/call-id-provider';
import logger from './logger';
import { MeldekortMelding } from './types/meldekort-melding';
import { FeatureToggles, toggleIsEnabled, unleashInit } from './unleash';

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer(consumerConfig);

let consumerJoinedGroup = false;
consumer.on(consumer.events.GROUP_JOIN, () => (consumerJoinedGroup = true));

function sjekkHentNesteFraKoToggle() {
    if (!consumerJoinedGroup) return;

    const hentNesteFraKo = toggleIsEnabled(FeatureToggles.HENT_NESTE_FRA_KO);
    const isConsuming = !consumer.paused().some(({ topic }) => topic === kafkaTopic);

    if (!hentNesteFraKo && isConsuming) {
        logger.info(`Feature toggle ${FeatureToggles.HENT_NESTE_FRA_KO} er deaktivert, pauser consumer`);
        consumer.pause([{ topic: kafkaTopic }]);
    }
    if (hentNesteFraKo && !isConsuming) {
        logger.info(`Feature toggle ${FeatureToggles.HENT_NESTE_FRA_KO} er aktivert, fortsetter consumer`);
        consumer.resume([{ topic: kafkaTopic }]);
    }
}

async function runConsumer() {
    await consumer.connect();
    await consumer.subscribe(consumerSubscribeTopics);

    await consumer.run({
        eachMessage: async ({ message, partition }) => {
            generateCallId();
            const { value, offset } = message;

            const offsetAndPartition = `${offset}-p${partition}`;

            if (!value) {
                logger.error({ callId, message: 'Ingen melding mottatt fra topic' });
                throw new Error('Ingen melding fra topic');
            }

            let meldekortMelding: MeldekortMelding;
            try {
                meldekortMelding = JSON.parse(value.toString());
            } catch (error) {
                const err = error as Error;
                logger.error({ err, callId, message: `Feil ved lesing av kafka melding: ${err.message}` });
                throw error;
            }

            await behandleMelding(meldekortMelding, offsetAndPartition);
        },
    });
}

(async () => {
    await unleashInit();
    setInterval(sjekkHentNesteFraKoToggle, 1000);
    runConsumer();
})();
