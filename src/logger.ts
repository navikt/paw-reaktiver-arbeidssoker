import pino from 'pino';

export default pino({
    timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
    formatters: {
        level: (label: string) => ({ level: label }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log: (object: any) => {
            object['x_callId'] = object.callId;
            delete object.timestamp;
            if (object.err) {
                const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
                object.stack_trace = err.stack;
                object.type = err.type;
                delete object.err;
            }

            return object;
        },
    },
    messageKey: 'message',
});
