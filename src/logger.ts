import pino from 'pino';
import ecsFormat from '@elastic/ecs-pino-format';

const logger = pino({
    ...ecsFormat({ apmIntegration: false }),
    formatters: {
        level: (label: string) => ({ level: label }),
    },
});

export default logger;
