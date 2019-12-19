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
  });
});
