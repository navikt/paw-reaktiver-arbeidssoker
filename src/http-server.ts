import http from 'node:http';

import { createMetrics } from './metrics';
import { consumerJoinedGroup } from './index';

const register = createMetrics();

export default function () {
    http.createServer(async (req, res) => {
        if (req.url?.includes('/isAlive')) {
            if (consumerJoinedGroup) {
                res.writeHead(200);
                res.end();
            } else {
                res.writeHead(500);
                res.end();
            }
        } else if (req.url?.includes('/isReady')) {
            res.writeHead(200);
            res.end();
        } else if (req.url?.includes('prometheus')) {
            res.setHeader('Content-type', register.contentType);
            res.end(await register.metrics());
        } else {
            res.writeHead(404);
            res.end();
        }
    }).listen(3000);
}
