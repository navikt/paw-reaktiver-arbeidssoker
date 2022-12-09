/// <reference lib="dom" />

import config from '../config';
import logger from '../logger';
import { TokenSet } from 'openid-client';

async function getAzureAdToken(scope: string): Promise<TokenSet | undefined> {
    try {
        const response = await fetch(config.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: config.AZURE_APP_CLIENT_ID,
                client_secret: config.AZURE_APP_CLIENT_SECRET,
                scope,
            }),
        });

        if (!response.ok) {
            throw response;
        }

        return await response.json();
    } catch (err) {
        logger.error(`Feil ved henting av azure ad token for scope:${scope}: ${err}`);
        return undefined;
    }
}

const getAiaBackendToken = async () => {
    const token = await getAzureAdToken(config.AIA_BACKEND_SCOPE);
    return token?.access_token;
};

export { getAiaBackendToken };
