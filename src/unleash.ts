import { isEnabled, startUnleash } from 'unleash-client';
import config from './config';

const unleashInit = () =>
    startUnleash({
        appName: 'paw-reaktiver-arbeidssoker',
        url: config.UNLEASH_SERVER_API_URL,
        customHeaders: {
            Authorization: config.UNLEASH_SERVER_API_TOKEN,
        },
    });

enum FeatureToggles {
    HENT_NESTE_FRA_KO = 'paw-reaktiver-arbeidssoker.hent-neste-fra-ko',
}

const toggleIsEnabled = (toggle: FeatureToggles) => {
    if (config.isDev) return true;
    return isEnabled(toggle);
};

export { FeatureToggles, toggleIsEnabled, unleashInit };
