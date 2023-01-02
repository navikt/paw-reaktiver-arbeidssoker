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
    NODE_ENV: 'prod' | 'development';
}

const env = process.env as unknown as IEnvironmentVariables;

export default {
    ...env,
    isProd: env.NODE_ENV === 'prod',
    isDev: env.NODE_ENV === 'development',
};
