import { ConsumerConfig, KafkaConfig } from 'kafkajs';

export interface IEnvironmentVariables {
    APP_NAME: string;
    KAFKA_TOPIC: string;
    KAFKA_BROKERS: string;
    KAFKA_CERTIFICATE: string;
    KAFKA_CA: string;
    KAFKA_PRIVATE_KEY: string;
    AIA_BACKEND_URL: string;
    VEILARBREGISTRERING_URL: string;
    VEILARBREGISTRERING_GCP_URL: string;
    AIA_BACKEND_SCOPE: string;
    VEILARBREGISTRERING_GCP_SCOPE: string;
    PAW_PROXY_SCOPE: string;
    AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: string;
    AZURE_APP_CLIENT_ID: string;
    AZURE_APP_CLIENT_SECRET: string;
    UNLEASH_API_URL: string;
    UNLEASH_ENVIRONMENT: string;
}

const env = process.env as unknown as IEnvironmentVariables;

export default {
    ...env,
    kafka: {
        config: {
            clientId: env.APP_NAME,
            brokers: [env.KAFKA_BROKERS],
            ssl: !env.KAFKA_CA
                ? false
                : {
                      rejectUnauthorized: false,
                      ca: [env.KAFKA_CA],
                      key: env.KAFKA_PRIVATE_KEY,
                      cert: env.KAFKA_CERTIFICATE,
                  },
        } as KafkaConfig,
        consumer: {
            groupId: `${env.APP_NAME}-group-v1`,
            // maxInFlightRequests: 3,
        } as ConsumerConfig,
    },
};
