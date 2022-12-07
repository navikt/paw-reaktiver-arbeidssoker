import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group-v1' });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                console.log(JSON.parse(message.value?.toString()));
            }
        },
    });
})();
