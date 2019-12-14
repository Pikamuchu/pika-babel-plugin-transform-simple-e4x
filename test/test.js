/* eslint-env node, mocha */
import { expect } from 'chai';
import { assert } from 'chai';

describe('babel-plugin-transform-simple-e4x', () => {
  it('should contain text', () => {
    const div = <div>test</div>;
    expect(div).to.equal('test');
  });

  it('should bind text', () => {
    const text = 'foo';
    const div = <div>{text}</div>;
    expect(div).to.equal('foo');
  });

  it('should extract attrs', () => {
    const div = <div id="hi" dir="ltr"></div>;
    expect(div.attribute('id')).to.equal('hi');
    expect(div.attribute('dir')).to.equal('ltr');
  });

  it('should bind attr', () => {
    const id = 'foo';
    const div = <div id={id}></div>;
    expect(div.attribute('id')).to.equal('foo');
  });

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
