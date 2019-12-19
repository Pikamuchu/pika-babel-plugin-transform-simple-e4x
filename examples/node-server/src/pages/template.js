export default body => (
  <html lang="en">
    <head>
      <title>Simple4x web example</title>
      <link rel="stylesheet" media="all" href="./main.css" />
    </head>
    <body>
      <div class="grid">
        <header>header</header>

        {body}

        <footer>footer</footer>
      </div>
    </body>
  </html>
);
