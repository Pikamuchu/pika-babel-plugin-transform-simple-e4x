/* eslint-env node, mocha */
import { expect } from 'chai';
import { assert } from 'chai';


describe('babel-plugin-transform-simple-e4x', () => {
  describe('Html processing tests', () => {
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

    it('html example as function return and function parameter', () => {
      const html = greeting => (
        <div class="grid">
          <header>header</header>
          <article>{greeting}</article>
          <footer>footer</footer>
        </div>
      );
      assert.equal(
        html('hello').toString(),
        (
          <div class="grid">
            <header>header</header>
            <article>hello</article>
            <footer>footer</footer>
          </div>
        ).toString()
      );
    });
  });

  describe('Xml processing tests', () => {
    it('complex example xml', () => {
      const fooId = 'foo-id';
      const barText = 'bar text';
      const xml = (
        <xml>
          <foo id={fooId}>{barText}</foo>
        </xml>
      );
      assert.equal(xml.toString(), '<xml>\n' + '  <foo id="foo-id">bar text</foo>\n' + '</xml>');
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

    it('xml manipulation sales example', () => {
      var sales = <sales vendor="John">
          <item type="peas" price="4" quantity="6"/>
          <item type="carrot" price="3" quantity="10"/>
          <item type="chips" price="5" quantity="3"/>
        </sales>;

      sales.item.toArray().forEach(
        item => assert.isNumber(Number(item.attribute('price')))
      );

//    TODO: Implement appendChild
//      sales.item += <item type="oranges" price="4"/>;
//      sales.item = sales.item + <item type="oranges" price="4"/>;
    });
  });

  describe('Xml templating tests', () => {
    it('xml templating sales example', () => {
      var items = [
        {
          t: 'peas',
          p: 4,
          q: 6,
        },
        {
          t: 'carrot',
          p: 4,
          q: 6,
        },
        {
          t: 'chips',
          p: 4,
          q: 6,
        }
      ]
      var sales = <sales vendor="John">
        {
          items.map( item =>
            <item type="{item.t}" price="{item.p}" quantity="{item.q}"/>
          )
        }
        </sales>;

      console.log(sales.toString());

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

