import * as utxoActions from '../../../../../../src/actions/bitcoin/wallet/utxos';
import utxosItemsReducer from '../../../../../../src/reducers/bitcoin/wallet/utxos/items';

describe('utxosItemsReducer', () => {
  it('is a function', () => {
    expect(typeof utxosItemsReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
    it('returns the utxos from the action', () => {
      const oldState = [{ txid: 'f8f0feed-9c38-4c1d-ae9e-399315ca84e3' }];
      const actionUtxos = [{ txid: '0ed7b233-84db-40b7-9a6f-90c891b11575' }];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
        utxos: actionUtxos
      };

      const newState = utxosItemsReducer(oldState, action);

      expect(newState).toBe(actionUtxos);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
    it('returns the utxos from the action', () => {
      const oldState = [{ txid: 'aa42c55a-6e74-4b26-a217-2c65a24fe781' }];
      const actionUtxos = [{ txid: 'e02d1388-aab2-4ec7-a0c0-23503ce4c628' }];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
        utxos: actionUtxos
      };

      const newState = utxosItemsReducer(oldState, action);

      expect(newState).toBe(actionUtxos);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS', () => {
    it('returns an empty array', () => {
      const oldState = [
        '465702fb-31e1-421c-a095-b64c072fb101',
        'd907ab6b-c59d-4874-b892-13afbf28fd02'
      ];

      const action = { type: utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS };
      const newState = utxosItemsReducer(oldState, action);
      const expectedState = [];

      expect(newState).toEqual(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = ['f9080601-df71-409f-8fd1-08ce849a3560'];
      const action = { type: 'UNKNOWN' };
      const newState = utxosItemsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty array', () => {
      const action = { type: 'UNKNOWN' };
      const newState = utxosItemsReducer(undefined, action);

      expect(newState).toEqual([]);
    });
  });
});
