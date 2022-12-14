import http from 'node:http';
import { randomUUID } from 'node:crypto';

const arbeidssokerperioderMockData = {
    '01020304050': {
        arbeidssokerperioder: [],
    },
    '50607080901': {
        arbeidssokerperioder: [
            {
                fraOgMedDato: '2022-12-12',
                tilOgMedDato: null,
            },
        ],
    },
    '12345678901': {
        arbeidssokerperioder: [
            {
                fraOgMedDato: '2021-12-12',
                tilOgMedDato: '2021-12-31',
            },
        ],
    },
};

http.createServer((req, res) => {
    console.log(req.url);
    let body = [] as any[];
    req.on('data', (chunk: any) => {
        body.push(chunk);
    }).on('end', () => {
        const data = JSON.parse(Buffer.concat(body).toString());
        const { fnr } = data;
        if (req.url === '/api/arbeidssoker/perioder') {
            const response = arbeidssokerperioderMockData[fnr];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } else if (req.url === '/api/fullfoerreaktivering/systembruker') {
            res.writeHead(204);
            res.end();
        } else if (req.url === '/m2m/automatisk-reaktivering') {
            res.writeHead(201);
            res.end();
        } else if (req.url === '/token') {
            const data = {
                access_token: randomUUID(),
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(204);
            res.end();
        }
    });
}).listen(3000, () => {
    console.log('Mock server startet');
});
