import {
  newAddress,
  PINE_LIGHTNING_RPC_NEW_ADDRESS
} from '../../../../../../src/actions/pine/lightning/rpc/newAddress';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      addresses: {
        internal: {
          unused: '2NGA3ZMty6TDVjSzwjciF8aoaYuPehKwx36'
        },
        external: {
          unused: '2N4kzkNaiqfWkf4rPxLNdefK3Tq1fUb3EJg'
        }
      }
    }
  }
}));

describe('PINE_LIGHTNING_RPC_NEW_ADDRESS', () => {
  it('equals "PINE_LIGHTNING_RPC_NEW_ADDRESS"', () => {
    expect(PINE_LIGHTNING_RPC_NEW_ADDRESS).toBe('PINE_LIGHTNING_RPC_NEW_ADDRESS');
  });
});

describe('newAddress', () => {
  it('is a function', () => {
    expect(typeof newAddress).toBe('function');
  });

  it('returns a new internal address when change is true', () => {
    const request = {
      type: 2,
      change: true
    };

    const expectedResponse = {
      address: '2NGA3ZMty6TDVjSzwjciF8aoaYuPehKwx36'
    };

    expect.hasAssertions();

    return newAddress(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });

  it('returns a new external address when change is false', () => {
    const request = {
      type: 2,
      change: false
    };

    const expectedResponse = {
      address: '2N4kzkNaiqfWkf4rPxLNdefK3Tq1fUb3EJg'
    };

    expect.hasAssertions();

    return newAddress(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });

  it('returns rejected promise when type is 0', () => {
    const request = {
      type: 0,
      change: false
    };

    expect.hasAssertions();

    return newAddress(request)(dispatchMock, getStateMock).catch(error => {
      expect(error.message).toBe('Address type 0 not supported');
    });
  });
});
