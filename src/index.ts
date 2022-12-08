import { Kafka } from 'kafkajs';
import config from './config';

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
                try {
                    const messageValue = JSON.parse(message.value?.toString());
                    console.log(messageValue);
                } catch (error) {
                    console.log(`Feil ved lesing av kafka melding: ${message}`);
                    console.error(error);
                }
            }
        },
    });
})();
