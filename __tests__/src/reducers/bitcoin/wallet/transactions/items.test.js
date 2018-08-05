import * as transactionsActions from '../../../../../../src/actions/bitcoin/wallet/transactions';
import transactionsItemsReducer from '../../../../../../src/reducers/bitcoin/wallet/transactions/items';

describe('transactionsItemsReducer', () => {
  it('is a function', () => {
    expect(typeof transactionsItemsReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS', () => {
    it('returns the addresses from the action', () => {
      const oldState = { '2cfe40d0-9748-44e4-aa66-f83b61b5a83e': {} };
      const actionTransactions = ['8d63e318-85e6-4b3d-be16-9b59305674f7'];

      const action = {
        type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS,
        transactions: actionTransactions
      };

      const newState = transactionsItemsReducer(oldState, action);

      expect(newState).toBe(actionTransactions);
    });
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS', () => {
    it('returns the old state with the new transactions added', () => {
      const oldState = ['5083126c-d8f8-49e2-887d-81c105044a52'];
      const actionTransactions = ['1e2e467a-714e-47fb-ac5f-c091f3f35819'];

      const action = {
        type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS,
        transactions: actionTransactions
      };

      const newState = transactionsItemsReducer(oldState, action);

      const expectedState = [
        '5083126c-d8f8-49e2-887d-81c105044a52',
        '1e2e467a-714e-47fb-ac5f-c091f3f35819'
      ];

      expect(newState).toEqual(expectedState);
    });
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS', () => {
    it('returns an empty array', () => {
      const oldState = [
        'cf8d2082-a44a-495e-86b8-670030eacbcc',
        '1918bca9-8181-4a45-9641-3d412fb8767c'
      ];

      const action = { type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS };
      const newState = transactionsItemsReducer(oldState, action);
      const expectedState = [];

      expect(newState).toEqual(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = ['403e7072-7587-482a-8fa4-70dd66eb8bad'];
      const action = { type: 'UNKNOWN' };
      const newState = transactionsItemsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty array', () => {
      const action = { type: 'UNKNOWN' };
      const newState = transactionsItemsReducer(undefined, action);

      expect(newState).toEqual([]);
    });
  });
});
