import { Context, isEnabled, startUnleash, Strategy } from 'unleash-client';
import config from './config';

class ByEnvironmentStrategy extends Strategy {
    isEnabled(parameters: { [key: string]: string }, context: Context): boolean {
        const environmentList: string[] = parameters['miljø']?.split(',') || [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return environmentList.includes(context.environment!);
    }
}

const unleashInit = () =>
    startUnleash({
        appName: 'paw-reaktiver-arbeidssoker',
        url: config.UNLEASH_API_URL,
        environment: config.UNLEASH_ENVIRONMENT,
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
