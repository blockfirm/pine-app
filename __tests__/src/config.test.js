import config from '../../src/config';

jest.unmock('../../src/config');

it('exports an object', () => {
  expect(typeof config).toBe('object');
});

describe('config', () => {
  describe('.bitcoin', () => {
    it('is an object', () => {
      expect(typeof config.bitcoin).toBe('object');
    });

    describe('.network', () => {
      it('equals "mainnet"', () => {
        expect(typeof config.bitcoin.network).toBe('string');
        expect(config.bitcoin.network).toBe('mainnet');
      });
    });
  });
});
