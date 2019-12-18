import http from 'http';
import nodeStatic from 'node-static';

const fileServer = new nodeStatic.Server('./dist');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(
      html('helloWorld!!').toString()
    );
  } else {
    fileServer.serveFile(req.url, 200, {}, req, res).on("error", () => {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found');
    });
  }
}).listen(1337, '127.0.0.1');

const html = (greeting) =>
  <html lang="en">
    <head>
      <title>Simple4x web example</title>
      <link rel="stylesheet" media="all" href="./main.css" />
    </head>
    <body>
      <div class="grid">
        <header>header</header>
        <article>
          {greeting}
        </article>
        <footer>footer</footer>
      </div>
    </body>
  </html>;

console.log('Server running at http://127.0.0.1:1337/');

export default server;
