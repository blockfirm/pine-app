import isAztecoUrl from '../../../../src/vendors/azteco/isAztecoUrl';

describe('isAztecoUrl', () => {
  it('is a function', () => {
    expect(typeof isAztecoUrl).toBe('function');
  });

  it('accepts one argument', () => {
    expect(isAztecoUrl.length).toBe(1);
  });

  it('returns true when the passed string is an Azteco URL', () => {
    const result = isAztecoUrl('https://azte.co?c1=1234&c2=1234&c3=1234&c4=1234');
    expect(result).toBe(true);
  });

  it('returns false when the passed string is a bitcoin URI', () => {
    const result = isAztecoUrl('bitcoin:2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm?amount=1.28');
    expect(result).toBe(false);
  });
});
