import getKeyPairFromMnemonic from '../../../../src/pineApi/crypto/getKeyPairFromMnemonic';
import getAuthorizationHeader from '../../../../src/pineApi/authentication/getAuthorizationHeader';

describe('getAuthorizationHeader', () => {
  it('is a function', () => {
    expect(typeof getAuthorizationHeader).toBe('function');
  });

  it('accepts four arguments', () => {
    expect(getAuthorizationHeader.length).toBe(4);
  });

  it('returns an HTTP Authorization header for the passed request details', () => {
    const user = 'user1@pine.pm';
    const path = '/v1/users';
    const rawBody = '{ "test": true }';
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const keyPair = getKeyPairFromMnemonic(mnemonic);
    const actualHeader = getAuthorizationHeader(user, path, rawBody, keyPair);
    const expectedHeader = 'Basic dXNlcjFAcGluZS5wbTpIemJSVmdSOTFRRjBScmV0c0xEQnIvL1UyU3lremJCdDR2R0R3ZktLN25ja0RoSG43c1plWlRFUFlrbk83SHBrWFdlOWc1ZkNScFlSYVR1dGxqVlRtVXc9';

    expect(actualHeader).toBe(expectedHeader);
  });
});
