import getPaymentInfoFromString from '../../../../src/crypto/bitcoin/getPaymentInfoFromString';

describe('getPaymentInfoFromString', () => {
  it('is a function', () => {
    expect(typeof getPaymentInfoFromString).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getPaymentInfoFromString.length).toBe(2);
  });

  it('returns undefined if the passed string is empty', () => {
    const paymentInfo = getPaymentInfoFromString('', 'testnet');
    expect(paymentInfo).toBe(undefined);
  });

  it('returns undefined if the passed string is undefined', () => {
    const paymentInfo = getPaymentInfoFromString(undefined, 'testnet');
    expect(paymentInfo).toBe(undefined);
  });

  it('returns undefined if the passed string is not a string', () => {
    const paymentInfo = getPaymentInfoFromString({}, 'testnet');
    expect(paymentInfo).toBe(undefined);
  });

  describe('when the string is a bitcoin URI', () => {
    it('returns an object with address and amount', () => {
      const uri = 'bitcoin:2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm?amount=1.28';
      const paymentInfo = getPaymentInfoFromString(uri, 'testnet');

      expect(paymentInfo).toMatchObject({
        address: '2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm',
        amount: 1.28
      });
    });

    it('returns undefined when address is invalid', () => {
      const uri = 'bitcoin:..,.,.?amount=1.28';
      const paymentInfo = getPaymentInfoFromString(uri, 'testnet');

      expect(paymentInfo).toBeUndefined();
    });

    it('returns undefined when amount is invalid', () => {
      const uri = 'bitcoin:2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm?amount=-1.28';
      const paymentInfo = getPaymentInfoFromString(uri, 'testnet');

      expect(paymentInfo).toBeUndefined();
    });

    it('returns amount as undefined when no amount is specified', () => {
      const uri = 'bitcoin:2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm';
      const paymentInfo = getPaymentInfoFromString(uri, 'testnet');

      expect(paymentInfo.address).toBe('2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm');
      expect(paymentInfo.amount).toBeUndefined();
    });
  });

  describe('when the string is a bitcoin address', () => {
    it('returns an object with address and amount as undefined', () => {
      const address = '2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm';
      const paymentInfo = getPaymentInfoFromString(address, 'testnet');

      expect(paymentInfo.address).toBe('2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm');
      expect(paymentInfo.amount).toBeUndefined();
    });

    it('trims whitespace from the passed string', () => {
      const address = ' 2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm\t\n';
      const paymentInfo = getPaymentInfoFromString(address, 'testnet');

      expect(paymentInfo.address).toBe('2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm');
    });
  });

  describe('when the bitcoin address is for the wrong network', () => {
    it('returns undefined', () => {
      const address = '2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm';
      const paymentInfo = getPaymentInfoFromString(address, 'mainnet');

      expect(paymentInfo).toBeUndefined();
    });
  });

  describe('when the string is not a bitcoin URI or address', () => {
    it('returns undefined', () => {
      const paymentInfo = getPaymentInfoFromString('964aba8b-cf23-49bd-99fe-93afcad61654', 'testnet');
      expect(paymentInfo).toBeUndefined();
    });
  });
});
