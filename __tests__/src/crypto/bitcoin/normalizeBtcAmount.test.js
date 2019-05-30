import normalizeBtcAmount from '../../../../src/crypto/bitcoin/normalizeBtcAmount';

describe('normalizeBtcAmount', () => {
  describe('normalizeBtcAmount(amount)', () => {
    it('is a function', () => {
      expect(typeof normalizeBtcAmount).toBe('function');
    });

    it('accepts one argument', () => {
      expect(normalizeBtcAmount.length).toBe(1);
    });

    it('returns 0 when amount is undefined', () => {
      const amount = undefined;
      const btc = normalizeBtcAmount(amount);

      expect(btc).toBe(0);
    });

    it('rounds to 8 decimals if input has more than 8', () => {
      expect(normalizeBtcAmount(0.123456789)).toBe(0.12345679);
      expect(normalizeBtcAmount(0.123456780000)).toBe(0.12345678);
      expect(normalizeBtcAmount(1.1111222200002)).toBe(1.11112222);
      expect(normalizeBtcAmount(1234.987654321)).toBe(1234.98765432);
      expect(normalizeBtcAmount(0.000000011)).toBe(0.00000001);
    });

    it('returns the same amount if it is correct', () => {
      expect(normalizeBtcAmount(0.001)).toBe(0.001);
      expect(normalizeBtcAmount(3.00009)).toBe(3.00009);
      expect(normalizeBtcAmount(1)).toBe(1);
      expect(normalizeBtcAmount(0.99999999)).toBe(0.99999999);
      expect(normalizeBtcAmount(4.5)).toBe(4.5);
      expect(normalizeBtcAmount(0.00000001)).toBe(0.00000001);
    });

    it('corrects javascript\'s loss of precision for floating-point arithmetic', () => {
      expect(normalizeBtcAmount(0.2 + 0.1)).toBe(0.3); // Not 0.30000000000000004.
      expect(normalizeBtcAmount(0.3 - 0.1)).toBe(0.2); // Not 0.19999999999999998.
      expect(normalizeBtcAmount(0.7 + 0.1)).toBe(0.8); // Not 0.7999999999999999.
      expect(normalizeBtcAmount(0.7 + 0.1 - 0.00000001)).toBe(0.79999999); // Not 0.7999999899999999.
      expect(normalizeBtcAmount(0.7 + 0.1 - 0.001)).toBe(0.799); // Not 0.7989999999999999.
      expect(normalizeBtcAmount(1111.11 + 1111.11 + 1111.11 + 1111.11 + 1111.11)).toBe(5555.55); // Not 5555.549999999999.
    });
  });
});
