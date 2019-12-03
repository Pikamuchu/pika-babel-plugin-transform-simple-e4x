/* eslint-env node, mocha */
import { expect } from 'chai'

describe('babel-plugin-transform-e4x', () => {
  it('should contain text', () => {
    const xml = <div>test</div>
    expect(xml.toString()).to.equal('<div>test</div>')
    expect(xml.div).to.equal('test')
  })

  it('should bind text', () => {
    const text = 'foo'
    const xml = <div>{text}</div>
    expect(xml.div.text).to.equal('foo')
  })

  it('should extract attrs', () => {
    const xml = <div id="hi" dir="ltr"></div>
    expect(xml.div.attrs.id).to.equal('hi')
    expect(xml.div.attrs.dir).to.equal('ltr')
  })

  it('should bind attr', () => {
    const id = 'foo'
    const xml = <div id={id}></div>
    expect(xml.div.attrs.id).to.equal('foo')
  })

  it('should omit children argument if possible', () => {
    const xml = <div />
    expect(xml.div).to.equal(undefined)
  })

  it('should handle top-level special attrs', () => {
    const xml =
      <div
        class="foo"
        style="bar"
        key="key"
        ref="ref"
        refInFor
        slot="slot">
      </div>
    expect(xml.div.class).to.equal('foo')
    expect(xml.div.style).to.equal('bar')
    expect(xml.div.key).to.equal('key')
    expect(xml.div.ref).to.equal('ref')
    expect(xml.div.refInFor).to.be.true
    expect(xml.div.slot).to.equal('slot')
  })
})
