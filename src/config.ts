export interface IEnvironmentVariables {
    KAFKA_TOPIC: string;
    KAFKA_BROKERS: string;
    AIA_BACKEND_URL: string;
    VEILARBREGISTRERING_URL: string;
    VEILARBREGISTRERING_GCP_URL: string;
}

const env = process.env as unknown as IEnvironmentVariables;

export default env;
