/* eslint-env node, mocha */
import { expect } from 'chai';
import { assert } from 'chai';


describe('babel-plugin-transform-simple-e4x', () => {
  describe('Parsing tests', () => {
    it('should contain text', () => {
      const html = (
        <html>
          <div>test</div>
        </html>
      );
      expect(html.div.toString()).to.equal('test');
    });

    it('should bind text', () => {
      const text = 'foo';
      const html = (
        <html>
          <div>{text}</div>
        </html>
      );
      expect(html.div.toString()).to.equal('foo');
    });

    it('should extract attrs', () => {
      const html = (
        <html>
          <div id="hi" dir="ltr"/>
        </html>
      );
      expect(html.div.attribute('id')).to.equal('hi');
      expect(html.div.attribute('dir')).to.equal('ltr');
    });

    it('should bind attr', () => {
      const id = 'foo';
      const html = (
        <html>
          <div id={id}></div>
        </html>
      );
      expect(html.div.attribute('id')).to.equal('foo');
    });

    it('complex example xml', () => {
      const fooId = 'foo-id';
      const barText = 'bar text';
      const xml = (
        <xml>
          <foo id={fooId}>{barText}</foo>
        </xml>
      );
      assert.equal(
        xml.toString(),
        '<xml>\n' +
        '  <foo id="foo-id">bar text</foo>\n' +
        '</xml>');
    });

    it('complex example person', () => {
      const name = 'Bob Smith';
      const browser = 'Firefox';
      const person = (
        <person>
          <name>{name}</name>
          <likes>
            <os>Linux</os>
            <browser>{browser}</browser>
            <language>JavaScript</language>
            <language>Python</language>
          </likes>
        </person>
      );
      assert.equal(person.name, name);
      assert.equal(person['name'], name);
      assert.equal(person.likes.browser, browser);
      assert.equal(person['likes'].browser, browser);
      assert.equal(person.likes.language[0], 'JavaScript');
    });
  });

  describe('Manipulation tests', () => {
    it('appendChild', () => {
      var sales = <sales vendor="John">
          <item type="peas" price="4" quantity="6"/>
          <item type="carrot" price="3" quantity="10"/>
        </sales>;

      sales.item += <item type="chips" price="5" quantity="3"/>;
      sales.item = sales.item + <item type="oranges" price="4" quantity="4"/>;

      sales.item.toArray().forEach(
        item => assert.isNumber(Number(item.attribute('price')))
      );

      assert.equal(
        sales.toXMLString(),
        '<sales vendor="John">\n' +
        '  <item type="peas" price="4" quantity="6"/>\n' +
        '  <item type="carrot" price="3" quantity="10"/>\n' +
        '  <item type="chips" price="5" quantity="3"/>\n' +
        '  <item type="oranges" price="4" quantity="4"/>\n' +
        '</sales>'
      );
    });
  });

  describe('Templating tests', () => {
    it('function', () => {
      const body = greeting => (
        <div class="grid">
          <header>header</header>
          <article>{greeting}</article>
          <footer>footer</footer>
        </div>
      );

      const html = <html>{body('hello')}</html>;

      assert.equal(
        html.toString(),
        (
          <html>
            <div class="grid">
              <header>header</header>
              <article>hello</article>
              <footer>footer</footer>
            </div>
          </html>
        ).toString()
      );
    });

    it('inline function', () => {
      const html = (
        <html>
          {(function() {
            var greeting = 'hello';
            return <div>{greeting}</div>;
          })()}
        </html>
      );

      assert.equal(
        html.toString(),
        (
          <html>
              <div>hello</div>
          </html>
        ).toString()
      );
    });

    it('conditionals', () => {
      var sayBye = true;
      var showButton = true;
      const html = (
        <html>
          {sayBye ? <span>Bye</span> : <div>hello</div>}
          {showButton && <button type="button">Click Me!</button>}
        </html>
      );

      assert.equal(
        html.toString(),
        (
          <html>
            <span>Bye</span>
            <button type="button">Click Me!</button>
          </html>
        ).toString()
      );
    });

    it('map iterator', () => {
      var items = [
        { t: 'peas', p: 4, q: 6 },
        { t: 'carrot', p: 4, q: 6 },
        { t: 'chips', p: 4, q: 6 }
      ];
      var sales = (
        <sales vendor="John">
          {items.map(item => (
            <item type="{item.t}" price="{item.p}" quantity="{item.q}" />
          ))}
        </sales>
      );

      assert.equal(
        sales.toString(),
        '<sales vendor="John">\n' +
        '  <item type="peas" price="4" quantity="6"/>\n' +
        '  <item type="carrot" price="4" quantity="6"/>\n' +
        '  <item type="chips" price="4" quantity="6"/>\n' +
        '</sales>'
      );
    });
  });
});

