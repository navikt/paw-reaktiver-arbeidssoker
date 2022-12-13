import { randomUUID } from 'node:crypto';

function generateHeaders(token: string) {
    return {
        'Content-Type': 'application/json',
        Authentication: `Bearer ${token}`,
        'nav-call-id': randomUUID(),
    };
}

export async function fetchData(url: string, token: string, data?: string) {
    const response = await fetch(url, {
        method: data ? 'POST' : 'GET',
        headers: generateHeaders(token),
        body: data,
    });

    if (response.ok) {
        const content = await response.json();
        return content;
    }
}
