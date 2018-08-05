import * as internalAddressActions from '../../../../../../../src/actions/bitcoin/wallet/addresses/internal';
import internalErrorReducer from '../../../../../../../src/reducers/bitcoin/wallet/addresses/internal/error';

const testRequestAction = (actionType) => {
  it('returns null', () => {
    const oldState = new Error('32e2a74b-ddae-40b9-9455-057f8199bb6f');
    const action = { type: actionType };
    const newState = internalErrorReducer(oldState, action);

    expect(newState).toBe(null);
  });
};

const testFailureAction = (actionType) => {
  it('returns the error from the action', () => {
    const oldState = new Error('4bec87ef-1233-40a8-ad57-241dc5cee9a1');
    const actionError = new Error('70a8d7ae-cec5-4b23-a70b-aacc7fbd1251');
    const action = { type: actionType, error: actionError };
    const newState = internalErrorReducer(oldState, action);

    expect(newState).toBe(actionError);
  });
};

describe('internalErrorReducer', () => {
  it('is a function', () => {
    expect(typeof internalErrorReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST', () => {
    testRequestAction(internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST', () => {
    testRequestAction(internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE', () => {
    testFailureAction(internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE', () => {
    testFailureAction(internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: '94c6c530-8ad0-450a-a219-4e6e9c74bec3' };
      const action = { type: 'UNKNOWN' };
      const newState = internalErrorReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = internalErrorReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
