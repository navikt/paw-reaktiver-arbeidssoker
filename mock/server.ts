import http from 'node:http';

http.createServer((req, res) => {
    const path = req.url;
    console.log(path);
    if (path === '/arbeidssoker') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{hello: world}');
    } else if (path === '/fullfoerreaktivering') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{hello: world}');
    } else if (path === '/lagre-data') {
        res.writeHead(204);
        res.end();
    } else {
        res.write('hello\n');
        res.end();
    }
}).listen(3000);
