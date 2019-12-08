import parse from '../../../../../src/clients/paymentServer/address/parse';

describe('parse', () => {
  it('is a function', () => {
    expect(typeof parse).toBe('function');
  });

  it('accepts one argument', () => {
    expect(parse.length).toBe(1);
  });

  it('returns an object containing the username and hostname of the address', () => {
    const address = 'timothy@pine.cash';
    const parsed = parse(address);

    expect(typeof parsed).toBe('object');
    expect(parsed.username).toBe('timothy');
    expect(parsed.hostname).toBe('pine.cash');
  });

  it('makes both username and hostname lowercase', () => {
    const address = 'Timothy@Pine.cash';
    const parsed = parse(address);

    expect(parsed.username).toBe('timothy');
    expect(parsed.hostname).toBe('pine.cash');
  });

  it('throws an error if username is missing', () => {
    const address = '@pine.cash';
    expect(parse.bind(null, address)).toThrowError();
  });

  it('throws an error if hostname is missing', () => {
    const address = 'timothy@';
    expect(parse.bind(null, address)).toThrowError();
  });

  it('throws an error if username is invalid', () => {
    const address = 'bad-@example.org';
    expect(parse.bind(null, address)).toThrowError();
  });

  it('throws an error if hostname is invalid', () => {
    const address = 'good_@...';
    expect(parse.bind(null, address)).toThrowError();
  });

  it('throws an error if the address is not valid', () => {
    const address = 'timothy';
    expect(parse.bind(null, address)).toThrowError();
  });
});
