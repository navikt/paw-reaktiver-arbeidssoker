/// <reference lib="dom" />

import config from '../config';
import { callId } from '../lib/call-id-provider';
import logger from '../logger';
import jwt from 'jsonwebtoken';

export const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwt.decode(token) as {
            exp: number;
        };
        const expirationDatetimeInSeconds = exp * 1000;

        return Date.now() >= expirationDatetimeInSeconds;
    } catch {
        return true;
    }
};

const tokenCache = {};

export default async function getAzureAdToken(scope: string): Promise<string> {
    const cachedToken = tokenCache[scope];
    if (cachedToken && !isTokenExpired(cachedToken.access_token)) {
        logger.info({ callId, message: `Bruker for token ${scope} fra cache` });
        return cachedToken.access_token;
    }

    try {
        const response = await fetch(config.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
                'nav-call-id': callId,
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

        const token = await response.json();
        tokenCache[scope] = token;
        return token.access_token;
    } catch (error) {
        const err = error as Error;
        logger.error({ err, callId }, `Feil ved henting av azure ad token for scope: ${scope}: ${err.message}`);
        throw error;
    }
}
