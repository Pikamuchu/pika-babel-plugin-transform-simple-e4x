var greeting = "Hello World!!";

var html = (
  <div class="grid">
    <header>header</header>

    <article>
      {greeting}
    </article>

    <footer>footer</footer>
  </div>
);

console.log(html);

document.getElementById('app').innerHTML = html;
