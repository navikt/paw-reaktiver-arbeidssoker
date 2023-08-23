import { Context, isEnabled, startUnleash, Strategy } from 'unleash-client';
import config from './config';
import logger from './logger';

class ByEnvironmentStrategy extends Strategy {
    isEnabled(parameters: { [key: string]: string }, context: Context): boolean {
        logger.info(parameters, 'isEnabled strategi - parametere');
        logger.info(context, 'isEnabled strategi - context');
        const environmentList: string[] = parameters['miljø']?.split(',') || [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return environmentList.includes(context.environment!);
    }
}

const unleashInit = () =>
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
    logger.info(`isEnabled: ${toggle}`);
    return isEnabled(toggle);
};

export { FeatureToggles, toggleIsEnabled, unleashInit };
