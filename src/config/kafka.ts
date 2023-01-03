import { ConsumerConfig, KafkaConfig, ConsumerSubscribeTopics } from 'kafkajs';

import config from './index';

export const kafkaTopic = config.KAFKA_TOPIC;

export const consumerConfig: ConsumerConfig = {
    groupId: `${config.APP_NAME}-group-v1`,
};

export const kafkaConfig: KafkaConfig = {
    clientId: config.APP_NAME,
    brokers: [config.KAFKA_BROKERS],
    ssl: !config.KAFKA_CA
        ? false
        : {
              rejectUnauthorized: false,
              ca: [config.KAFKA_CA],
              key: config.KAFKA_PRIVATE_KEY,
              cert: config.KAFKA_CERTIFICATE,
          },
};

export const consumerSubscribeTopics: ConsumerSubscribeTopics = {
    topics: [config.KAFKA_TOPIC],
    fromBeginning: false,
};
