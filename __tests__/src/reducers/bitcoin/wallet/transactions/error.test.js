import * as transactionsActions from '../../../../../../src/actions/bitcoin/wallet/transactions';
import transactionsErrorReducer from '../../../../../../src/reducers/bitcoin/wallet/transactions/error';

const testRequestAction = (actionType) => {
  it('returns null', () => {
    const oldState = new Error('305702a4-e499-429a-bd35-fafdb7dca98f');
    const action = { type: actionType };
    const newState = transactionsErrorReducer(oldState, action);

    expect(newState).toBe(null);
  });
};

const testFailureAction = (actionType) => {
  it('returns the error from the action', () => {
    const oldState = new Error('623c3f50-9401-47ab-bb67-67078f84dfa1');
    const actionError = new Error('0456854a-56ed-42e6-a778-53a85cb525ad');
    const action = { type: actionType, error: actionError };
    const newState = transactionsErrorReducer(oldState, action);

    expect(newState).toBe(actionError);
  });
};

describe('transactionsErrorReducer', () => {
  it('is a function', () => {
    expect(typeof transactionsErrorReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST', () => {
    testRequestAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST', () => {
    testRequestAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE', () => {
    testFailureAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE', () => {
    testFailureAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: 'd8a66e99-a0ab-4daf-8ee4-4071769d48f4' };
      const action = { type: 'UNKNOWN' };
      const newState = transactionsErrorReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = transactionsErrorReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
