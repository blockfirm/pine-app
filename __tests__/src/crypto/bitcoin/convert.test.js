import * as convertBitcoin from '../../../../src/crypto/bitcoin/convert';

describe('convert', () => {
  describe('UNIT_BTC', () => {
    it('equals "BTC"', () => {
      expect(convertBitcoin.UNIT_BTC).toBe('BTC');
    });
  });

  describe('UNIT_MBTC', () => {
    it('equals "mBTC"', () => {
      expect(convertBitcoin.UNIT_MBTC).toBe('mBTC');
    });
  });

  describe('UNIT_SATOSHIS', () => {
    it('equals "Satoshis"', () => {
      expect(convertBitcoin.UNIT_SATOSHIS).toBe('Satoshis');
    });
  });

  describe('convert(amount, toUnit, fromUnit)', () => {
    it('is a function', () => {
      expect(typeof convertBitcoin.convert).toBe('function');
    });

    it('accepts three arguments', () => {
      expect(convertBitcoin.convert.length).toBe(3);
    });

    describe('when amount is undefined', () => {
      it('returns 0', () => {
        const amount = undefined;
        const fromUnit = convertBitcoin.UNIT_BTC;
        const toUnit = convertBitcoin.UNIT_MBTC;
        const mbtc = convertBitcoin.convert(amount, fromUnit, toUnit);

        expect(mbtc).toBe(0);
      });
    });

    describe('from BTC', () => {
      it('converts to mBTC', () => {
        const btc = 2.83;
        const fromUnit = convertBitcoin.UNIT_BTC;
        const toUnit = convertBitcoin.UNIT_MBTC;
        const mbtc = convertBitcoin.convert(btc, fromUnit, toUnit);

        expect(mbtc).toBe(2830);
      });

      it('converts to Satoshis', () => {
        const btc = 5.8;
        const fromUnit = convertBitcoin.UNIT_BTC;
        const toUnit = convertBitcoin.UNIT_SATOSHIS;
        const satoshis = convertBitcoin.convert(btc, fromUnit, toUnit);

        expect(satoshis).toBe(580000000);
      });
    });

    describe('from mBTC', () => {
      it('converts to BTC', () => {
        const mbtc = 2830;
        const fromUnit = convertBitcoin.UNIT_MBTC;
        const toUnit = convertBitcoin.UNIT_BTC;
        const btc = convertBitcoin.convert(mbtc, fromUnit, toUnit);

        expect(btc).toBe(2.83);
      });

      it('converts to Satoshis', () => {
        const mbtc = 5800;
        const fromUnit = convertBitcoin.UNIT_MBTC;
        const toUnit = convertBitcoin.UNIT_SATOSHIS;
        const satoshis = convertBitcoin.convert(mbtc, fromUnit, toUnit);

        expect(satoshis).toBe(580000000);
      });
    });

    describe('from Satoshis', () => {
      it('converts to BTC', () => {
        const satoshis = 283000000;
        const fromUnit = convertBitcoin.UNIT_SATOSHIS;
        const toUnit = convertBitcoin.UNIT_BTC;
        const btc = convertBitcoin.convert(satoshis, fromUnit, toUnit);

        expect(btc).toBe(2.83);
      });

      it('converts to mBTC', () => {
        const satoshis = 580000000;
        const fromUnit = convertBitcoin.UNIT_SATOSHIS;
        const toUnit = convertBitcoin.UNIT_MBTC;
        const mbtc = convertBitcoin.convert(satoshis, fromUnit, toUnit);

        expect(mbtc).toBe(5800);
      });
    });
  });
});
