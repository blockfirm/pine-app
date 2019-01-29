import resolveBaseUrl from '../../../../src/PinePaymentProtocol/address/resolveBaseUrl';

describe('resolveBaseUrl', () => {
  it('is a function', () => {
    expect(typeof resolveBaseUrl).toBe('function');
  });

  it('accepts one argument', () => {
    expect(resolveBaseUrl.length).toBe(1);
  });

  it('throws an error when the hostname is empty', () => {
    expect(resolveBaseUrl.bind(null, '')).toThrowError();
  });

  describe('domain names', () => {
    it('resolves example.com to https://_pine.example.com', () => {
      const hostname = 'example.com';
      const expectedUrl = 'https://_pine.example.com';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });

    it('resolves sub.test.org to https://_pine.sub.test.org', () => {
      const hostname = 'sub.test.org';
      const expectedUrl = 'https://_pine.sub.test.org';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });
  });

  describe('hostnames', () => {
    it('resolves localhost to https://localhost:50428', () => {
      const hostname = 'localhost';
      const expectedUrl = 'http://localhost:50428';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });

    it('resolves test to https://test:50428', () => {
      const hostname = 'test';
      const expectedUrl = 'http://test:50428';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });
  });

  describe('IP numbers', () => {
    it('resolves 127.0.0.1 to http://127.0.0.1:50428', () => {
      const hostname = '127.0.0.1';
      const expectedUrl = 'http://127.0.0.1:50428';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });

    it('resolves 192.168.0.5 to http://192.168.0.5:50428', () => {
      const hostname = '192.168.0.5';
      const expectedUrl = 'http://192.168.0.5:50428';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });

    it('resolves 255.255.255.255 to http://255.255.255.255:50428', () => {
      const hostname = '255.255.255.255';
      const expectedUrl = 'http://255.255.255.255:50428';

      expect(resolveBaseUrl(hostname)).toBe(expectedUrl);
    });
  });
});
