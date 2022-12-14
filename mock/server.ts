import http from 'node:http';
import { randomUUID } from 'node:crypto';

http.createServer((req, res) => {
    const path = req.url;
    console.log(path);
    if (path === '/api/arbeidssoker/perioder') {
        const data = {
            arbeidssokerperioder: [],
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if (path === '/api/fullfoerreaktivering/systembruker') {
        res.writeHead(204);
        res.end();
    } else if (path === '/m2m/automatisk-reaktivering') {
        res.writeHead(201);
        res.end();
    } else if (path === '/token') {
        const data = {
            access_token: randomUUID(),
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(204);
        res.end();
    }
}).listen(3000);
