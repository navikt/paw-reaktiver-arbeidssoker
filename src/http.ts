import { randomUUID } from 'node:crypto';

import logger from './logger';

function generateHeaders(token: string) {
    return {
        'Content-Type': 'application/json',
        Authentication: `Bearer ${token}`,
        'nav-call-id': randomUUID(),
    };
}

export async function fetchData(url: string, token: string, data?: string) {
    const headers = generateHeaders(token);

    logger.info(`Starter kall mot ${url} med callId ${headers['nav-call-id']}`);

    const response = await fetch(url, {
        method: data ? 'POST' : 'GET',
        headers,
        body: data,
        credentials: 'include',
    });

    if (response.ok) {
        logger.info(`Kall mot ${url} med callId ${headers['nav-call-id']} - suksess`);
        const content = await response.json();
        return content;
    }
    logger.error(`Kall mot ${url} feilet med ${response.status}`);
}
