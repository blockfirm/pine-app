import * as transactionsActions from '../../../../../../src/actions/bitcoin/wallet/transactions';
import transactionsItemsReducer from '../../../../../../src/reducers/bitcoin/wallet/transactions/items';

describe('transactionsItemsReducer', () => {
  it('is a function', () => {
    expect(typeof transactionsItemsReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS', () => {
    it('returns the transactions from the action', () => {
      const oldState = [{ txid: '58a8362d-246a-415d-8199-b3583ab6028b' }];
      const actionTransactions = [{ txid: '0cf576ee-df40-4a5c-ae11-346cc522f8b5' }];

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
      const oldState = [{ txid: '5083126c-d8f8-49e2-887d-81c105044a52' }];
      const actionTransactions = [{ txid: '1e2e467a-714e-47fb-ac5f-c091f3f35819' }];

      const action = {
        type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS,
        transactions: actionTransactions
      };

      const newState = transactionsItemsReducer(oldState, action);

      const expectedState = [
        { txid: '5083126c-d8f8-49e2-887d-81c105044a52' },
        { txid: '1e2e467a-714e-47fb-ac5f-c091f3f35819' }
      ];

      expect(newState).toEqual(expectedState);
    });

    it('only adds new unique transactions based on txid', () => {
      const oldState = [{ txid: 'a88494ac-beb7-4884-adbe-da80e07c8fb5' }];

      const actionTransactions = [
        { txid: 'a88494ac-beb7-4884-adbe-da80e07c8fb5' },
        { txid: '5c806976-34f5-4c20-b967-08b944e063d6' },
        { txid: '5c806976-34f5-4c20-b967-08b944e063d6' },
        { txid: 'a548538f-a421-47d5-b763-6097ac8d4239' }
      ];

      const action = {
        type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS,
        transactions: actionTransactions
      };

      const newState = transactionsItemsReducer(oldState, action);

      const expectedState = [
        { txid: 'a88494ac-beb7-4884-adbe-da80e07c8fb5' },
        { txid: '5c806976-34f5-4c20-b967-08b944e063d6' },
        { txid: 'a548538f-a421-47d5-b763-6097ac8d4239' }
      ];

      expect(newState).toEqual(expectedState);
    });
  });

  describe('when action is BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS', () => {
    it('returns the old state with the new transactions updated', () => {
      const oldState = [
        { txid: '4170d601-a7a3-4230-945a-9b9e9c72bed0', confirmations: 0 },
        { txid: '3473c18e-5a73-4c47-9a29-df22f26e8831', confirmations: 2 },
        { txid: '9414508e-d94b-46be-9688-6bedca634984', confirmations: 7 },
        { txid: '010bdf30-326f-49dc-9b37-71613bd549fe', confirmations: 98 },
        { txid: '9f770e8b-7e5f-42d8-82b4-e8619a2db7c0', confirmations: null },
        { txid: '46abb8fb-eadf-45d1-8f0f-ba7d51962499', confirmations: 1 }
      ];

      const actionTransactions = [
        { txid: '9f770e8b-7e5f-42d8-82b4-e8619a2db7c0', confirmations: 2 },
        { txid: '4170d601-a7a3-4230-945a-9b9e9c72bed0', confirmations: 1 }
      ];

      const action = {
        type: transactionsActions.BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS,
        transactions: actionTransactions
      };

      const newState = transactionsItemsReducer(oldState, action);

      const expectedState = [
        { txid: '4170d601-a7a3-4230-945a-9b9e9c72bed0', confirmations: 1 },
        { txid: '3473c18e-5a73-4c47-9a29-df22f26e8831', confirmations: 2 },
        { txid: '9414508e-d94b-46be-9688-6bedca634984', confirmations: 7 },
        { txid: '010bdf30-326f-49dc-9b37-71613bd549fe', confirmations: 98 },
        { txid: '9f770e8b-7e5f-42d8-82b4-e8619a2db7c0', confirmations: 2 },
        { txid: '46abb8fb-eadf-45d1-8f0f-ba7d51962499', confirmations: 1 }
      ];

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
