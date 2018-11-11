import { disconnected as disconnectedFromInternet, NETWORK_INTERNET_DISCONNECTED } from '../../../../../src/actions/network/internet/disconnected';

describe('NETWORK_INTERNET_DISCONNECTED', () => {
  it('equals "NETWORK_INTERNET_DISCONNECTED"', () => {
    expect(NETWORK_INTERNET_DISCONNECTED).toBe('NETWORK_INTERNET_DISCONNECTED');
  });
});

describe('disconnected', () => {
  it('is a function', () => {
    expect(typeof disconnectedFromInternet).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(disconnectedFromInternet.length).toBe(0);
  });

  it('returns an object with type set to NETWORK_INTERNET_DISCONNECTED', () => {
    const returnValue = disconnectedFromInternet();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(NETWORK_INTERNET_DISCONNECTED);
  });
});
