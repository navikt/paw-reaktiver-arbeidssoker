import { Context, isEnabled, startUnleash, Strategy } from 'unleash-client';
import config from './config';
import logger from './logger';

class ByEnvironmentStrategy extends Strategy {
    isEnabled(parameters: { [key: string]: string }, context: Context): boolean {
        const environmentList: string[] = parameters['miljø']?.split(',') || [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return environmentList.includes(context.environment!);
    }
}

const unleashInit = () => logger.info(`UNLEASH_SERVER_API_TOKEN ${config.UNLEASH_SERVER_API_TOKEN}`);
startUnleash({
    appName: 'paw-reaktiver-arbeidssoker',
    url: config.UNLEASH_SERVER_API_URL,
    customHeaders: {
        Authorization: config.UNLEASH_SERVER_API_TOKEN,
    },
    strategies: [new ByEnvironmentStrategy('byEnvironment')],
});

enum FeatureToggles {
    HENT_NESTE_FRA_KO = 'paw-reaktiver-arbeidssoker.hent-neste-fra-ko',
}

const toggleIsEnabled = (toggle: FeatureToggles) => {
    if (config.isDev) return true;

    return isEnabled(toggle);
};

export { FeatureToggles, toggleIsEnabled, unleashInit };
