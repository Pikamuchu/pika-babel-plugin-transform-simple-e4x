var id = 'elementId';
var text = "Here's some text!!";
var moreText = "More Text";
var html = (
  <div>
    <div id={id}>{text}</div>
    <span>{moreText}</span>
  </div>
);
document.getElementById('app').innerHTML = html;
