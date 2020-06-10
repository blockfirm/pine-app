import {
  isOurAddress,
  PINE_LIGHTNING_RPC_IS_OUR_ADDRESS
} from '../../../../../src/actions/lightning/rpc/isOurAddress';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => require('../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));
  }

  return action;
});

const getStateMock = jest.fn(() => require('../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));

describe('PINE_LIGHTNING_RPC_IS_OUR_ADDRESS', () => {
  it('equals "PINE_LIGHTNING_RPC_IS_OUR_ADDRESS"', () => {
    expect(PINE_LIGHTNING_RPC_IS_OUR_ADDRESS).toBe('PINE_LIGHTNING_RPC_IS_OUR_ADDRESS');
  });
});

describe('isOurAddress', () => {
  it('is a function', () => {
    expect(typeof isOurAddress).toBe('function');
  });

  it('returns true when the address belongs to the wallet (external)', () => {
    const request = {
      address: '2NAJ1JqVtTQUuQdA1imxSBfNXv9EqviwKW4'
    };

    const expectedResponse = {
      isOurAddress: true
    };

    return isOurAddress(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });

  it('returns true when the address belongs to the wallet (internal)', () => {
    const request = {
      address: '2MsJkXrE1V7zFRMMJswigb3hJrX82pWMutv'
    };

    const expectedResponse = {
      isOurAddress: true
    };

    return isOurAddress(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });

  it('returns false when the address does not belong to the wallet', () => {
    const request = {
      address: 'mh26xTvjp16VYHg8Xa31mzo4Di8FacYiv9'
    };

    const expectedResponse = {
      isOurAddress: false
    };

    return isOurAddress(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });
});
