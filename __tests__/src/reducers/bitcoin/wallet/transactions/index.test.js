import * as transactionsActions from '../../../../../../src/actions/bitcoin/wallet/transactions';
import transactionsReducer from '../../../../../../src/reducers/bitcoin/wallet/transactions';

jest.mock('../../../../../../src/reducers/bitcoin/wallet/transactions/error', () => {
  return jest.fn(() => 'c7ca2f7b-0b0d-4744-b65a-1615e363c572');
});

jest.mock('../../../../../../src/reducers/bitcoin/wallet/transactions/items', () => {
  return jest.fn(() => 'af809498-7ab1-43d9-8d73-196fbf16e23c');
});

const testAction = (actionType) => {
  let newState;

  beforeEach(() => {
    const oldState = {
      attr: '0aa0bd80-af8d-48c4-9a69-92a4bb30010e',
      error: '829216d2-961e-48b5-8b2a-84ceb4226442',
      items: []
    };

    const action = {
      type: actionType
    };

    newState = transactionsReducer(oldState, action);
  });

  it('returns a copy of the old state except error and items', () => {
    expect(typeof newState).toBe('object');
    expect(newState.attr).toBe('0aa0bd80-af8d-48c4-9a69-92a4bb30010e');
  });

  it('sets .error to the return value from error()', () => {
    // This value is mocked at the top.
    expect(newState.error).toBe('c7ca2f7b-0b0d-4744-b65a-1615e363c572');
  });

  it('sets .items to the return value from items()', () => {
    // This value is mocked at the top.
    expect(newState.items).toBe('af809498-7ab1-43d9-8d73-196fbf16e23c');
  });
};

describe('transactionsReducer', () => {
  it('is a function', () => {
    expect(typeof transactionsReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE', () => {
    testAction(transactionsActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: 'c6bf4167-eeaa-4da1-8a04-0c88da8027af' };
      const action = { type: 'UNKNOWN' };
      const newState = transactionsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });
});
