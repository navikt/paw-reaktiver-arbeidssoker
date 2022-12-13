import { Kafka } from 'kafkajs';

import config from './config';
import logger from './logger';

import { skalMeldingBehandles } from './lib/skal-melding-behandles';

import { Melding } from './types/melding';

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

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: config.KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                const { value, offset } = message;
                try {
                    const messageJSON = JSON.parse(value.toString()) as Melding;
                    const skalBehandles = skalMeldingBehandles(messageJSON);
                    if (skalBehandles) {
                        logger.info(`Behandler meldingen med offset - ${offset}`);
                        /**
                         * - Sjekker om arbeidssøkeren ikke har aktiv arbeidssøkerperiode
                         *      - henter arbeidssøkerperioder og kjører resultatet gjennom kan-arbeidsøkeren-reaktiveres
                         * - Hvis ikke reaktivering er aktuelt: Avbryt
                         * - Hvis reaktivering er aktuelt:
                         *      - reaktiver arbeidssøker
                         *      - hvis reaktivering feiler: avbryt
                         *      - hvis reaktivering suksess
                         *          - post melding om reaktivering til AiA-backend
                         */
                    } else {
                        logger.info(`Meldingen med offset - ${offset} - skal ikke behandles`);
                    }
                } catch (error) {
                    logger.error(`Feil ved lesing av kafka melding: ${error}`);
                }
            }
        },
    });
})();
