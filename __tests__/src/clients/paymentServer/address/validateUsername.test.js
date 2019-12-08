import validateUsername from '../../../../../src/clients/paymentServer/address/validateUsername';

describe('validateUsername', () => {
  it('is a function', () => {
    expect(typeof validateUsername).toBe('function');
  });

  it('accepts one argument', () => {
    expect(validateUsername.length).toBe(1);
  });

  it('throws an error when the username is empty', () => {
    expect(validateUsername.bind(null, '')).toThrowError();
  });

  it('throws an error when the username is undefined', () => {
    expect(validateUsername.bind(null)).toThrowError();
  });

  it('throws an error when the username is longer than 30 characters', () => {
    const longUsername = '5cbfc5ed-65a1-47c8-abeb-b6b08a';
    expect(validateUsername.bind(null, longUsername)).toThrowError();
  });

  it('throws an error when the username contains non-latin letters', () => {
    expect(validateUsername.bind(null, 'åäösd')).toThrowError();
  });

  it('throws an error when the username contains uppercase letters', () => {
    expect(validateUsername.bind(null, 'UpperCase')).toThrowError();
  });

  it('returns true when the username only contains a-z, 0-9, _, and .', () => {
    expect(validateUsername('joe')).toBe(true);
    expect(validateUsername('john_123')).toBe(true);
    expect(validateUsername('test.')).toBe(true);
    expect(validateUsername('98798')).toBe(true);
  });
});
