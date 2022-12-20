import logger from './logger';
import { callId } from './lib/call-id-provider';

function generateHeaders(token: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'nav-call-id': callId,
    };
}

export default async function fetchData(url: string, token: string, data?: string) {
    const headers = generateHeaders(token);

    logger.info({ callId, message: `Starter kall mot ${url} med callId ${callId}` });

    const response = await fetch(url, {
        method: data ? 'POST' : 'GET',
        headers,
        body: data,
        credentials: 'include',
    });

    if (response.ok) {
        logger.info({ callId, message: `Kall mot ${url} med callId ${callId} - suksess` });
        if (response.status === 204) return;
        const content = await response.json();
        return content;
    }
    logger.error({ callId, message: `Kall mot ${url} feilet med ${response.status}` });
    const errorText = await response.text();
    logger.error({ callId, message: errorText });
    throw new Error(`Kall mot ${url} feilet med ${response.status}`);
}
