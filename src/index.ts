import { Kafka } from 'kafkajs';
import config from './config';

const kafka = new Kafka({
    clientId: 'paw-reaktiver-arbeidssoker',
    brokers: [config.KAFKA_BROKERS],
    ssl: {
        rejectUnauthorized: false,
        ca: [config.KAFKA_CA],
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERTIFICATE,
    },
});

const consumer = kafka.consumer({ groupId: 'test-group-v1' });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: config.KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                console.log(JSON.parse(message.value?.toString()));
            }
        },
    });
})();
