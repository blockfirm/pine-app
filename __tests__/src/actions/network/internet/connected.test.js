import { connected as connectedToInternet, NETWORK_INTERNET_CONNECTED } from '../../../../../src/actions/network/internet/connected';

describe('NETWORK_INTERNET_CONNECTED', () => {
  it('equals "NETWORK_INTERNET_CONNECTED"', () => {
    expect(NETWORK_INTERNET_CONNECTED).toBe('NETWORK_INTERNET_CONNECTED');
  });
});

describe('connected', () => {
  it('is a function', () => {
    expect(typeof connectedToInternet).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(connectedToInternet.length).toBe(0);
  });

  it('returns an object with type set to NETWORK_INTERNET_CONNECTED', () => {
    const returnValue = connectedToInternet();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(NETWORK_INTERNET_CONNECTED);
  });
});
