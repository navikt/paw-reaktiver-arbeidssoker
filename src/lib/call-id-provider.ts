import { randomUUID } from 'node:crypto';

export let callId = '';

export function generateCallId() {
    const uuid = randomUUID();
    callId = uuid;
    return uuid;
}
