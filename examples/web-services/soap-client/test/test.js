/* eslint-env node, mocha */
import { assert } from 'chai';

describe('soap-client-example', () => {
  describe('Temperature convert service tests', () => {
    const service = require('../src/tempConvertService');
    it('FahrenheitToCelsius', async () => {
      const temperature = await service.fahrenheitToCelsius(32);
      assert.equal(temperature, 0);
    });
  });
});

