import http from 'http';
import nodeStatic from 'node-static';
import mainPage from './pages/mainPage';

const fileServer = new nodeStatic.Server('./public');

const server = http
  .createServer((req, res) => {
    if (req.url.endsWith('.css')) {
      fileServer.serveFile(req.url, 200, {}, req, res).on('error', () => {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(mainPage('Welcome to simple4x example page: ' + req.url).toString());
    }
  })
  .listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

export default server;
