/* eslint-env node, mocha */
import { assert } from 'chai';

describe('babel-plugin-transform-simple-e4x', () => {
  describe('Parsing tests', () => {
    it('should contain text', () => {
      const xml = (
        <xml>
          <foo>test</foo>
        </xml>
      );
      assert.equal(xml.foo.toString(), 'test');
    });

    it('should bind text', () => {
      const text = 'foo';
      const xml = (
        <xml>
          <foo>{text}</foo>
        </xml>
      );
      assert.equal(xml.foo.toString(), 'foo');
    });

    it('should extract attrs', () => {
      const xml = (
        <xml>
          <foo id="hi" dir="ltr"/>
        </xml>
      );
      assert.equal(xml.foo.attribute('id'), 'hi');
      assert.equal(xml.foo.attribute('dir'), 'ltr');
    });

    it('should bind attr', () => {
      const id = 'foo';
      const xml = (
        <xml>
          <foo id={id}></foo>
        </xml>
      );
      assert.equal(xml.foo.attribute('id'), 'foo');
    });

    it('should append child', () => {
      const fooId = 'foo-id';
      const barText = 'bar text';
      let xml = (
        <xml>
          <foo id={fooId}>{barText}</foo>
        </xml>
      );
      xml += <var id="var-id"/>;
      assert.equal(
        xml.toString(),
        '<xml>\n' +
        '  <foo id="foo-id">bar text</foo>\n' +
        '  <var id="var-id"/>\n' +
        '</xml>');
    });

    it('should parse person example', () => {
      let person;
      const name = 'Bob Smith';
      const browser = 'Firefox';
      person = (
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
      const createFooElements = greeting => (
        <foo class="rid">
          <zab>zabText</zab>
          <bar>{greeting}</bar>
          <rab>rabText</rab>
        </foo>
      );

      const xml = <xml>{createFooElements('barText')}</xml>;

      assert.equal(
        xml.toString(),
        (
          <xml>
            <foo class="rid">
              <zab>zabText</zab>
              <bar>barText</bar>
              <rab>rabText</rab>
            </foo>
          </xml>
        ).toString()
      );
    });

    it('inline function', () => {
      const xml = (
        <xml>
          {(function() {
            var zab = 'zabText';
            return <foo>{zab}</foo>;
          })()}
        </xml>
      );

      assert.equal(
        xml.toString(),
        (
          <xml>
              <foo>zabText</foo>
          </xml>
        ).toString()
      );
    });

    it('conditionals', () => {
      var isBar = true;
      var rabText = 'RAB';
      const xml = (
        <xml>
          {isBar ? <bar>Bye</bar> : <foo>hello</foo>}
          {rabText && <rab type="rab">{rabText}</rab>}
        </xml>
      );

      assert.equal(
        xml.toString(),
        (
          <xml>
            <bar>Bye</bar>
            <rab type="rab">RAB</rab>
          </xml>
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

