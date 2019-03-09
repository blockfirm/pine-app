import validateHostname from '../../../../src/pineApi/address/validateHostname';

describe('validateHostname', () => {
  it('is a function', () => {
    expect(typeof validateHostname).toBe('function');
  });

  it('accepts one argument', () => {
    expect(validateHostname.length).toBe(1);
  });

  it('throws an error when the hostname is empty', () => {
    expect(validateHostname.bind(null, '')).toThrowError();
  });

  it('throws an error when the hostname is undefined', () => {
    expect(validateHostname.bind(null)).toThrowError();
  });

  it('throws an error when the hostname is longer than 50 characters', () => {
    const longHostname = '2a68fb51-6b72-486c-bf07-defc1187cb0f2a68fb51-6b72-486c-bf07-defc1187cb0f2a68fb51-6b72-486c-bf07-d';
    expect(validateHostname.bind(null, longHostname)).toThrowError();
  });

  it('throws an error when the hostname contains non-latin letters', () => {
    expect(validateHostname.bind(null, 'åäösd')).toThrowError();
  });

  it('returns true when the hostname is a valid domain name', () => {
    expect(validateHostname('pine.cash')).toBe(true);
    expect(validateHostname('example.com')).toBe(true);
  });

  it('returns true when the hostname is localhost', () => {
    expect(validateHostname('localhost')).toBe(true);
  });

  it('returns true when the hostname is an IP number', () => {
    expect(validateHostname('127.0.0.1')).toBe(true);
  });
});
