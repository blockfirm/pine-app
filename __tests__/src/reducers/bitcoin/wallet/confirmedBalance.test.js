import * as utxoActions from '../../../../../src/actions/bitcoin/wallet/utxos';
import confirmedBalanceReducer from '../../../../../src/reducers/bitcoin/wallet/confirmedBalance';

describe('confirmedBalanceReducer', () => {
  it('is a function', () => {
    expect(typeof confirmedBalanceReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
    it('returns the sum of all confirmed utxos', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.10624246, confirmed: true },
        { value: 0.23909878, confirmed: false },
        { value: 1.5992992, confirmed: true }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
        utxos: actionUtxos
      };

      const newState = confirmedBalanceReducer(oldState, action);

      expect(newState).toBe(1.70554166);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
    it('returns the sum of all confirmed utxos', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.00163507, confirmed: false },
        { value: 0.006, confirmed: true },
        { value: 0.004, confirmed: true },
        { value: 0.00187419, confirmed: false }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
        utxos: actionUtxos
      };

      const newState = confirmedBalanceReducer(oldState, action);

      expect(newState).toBe(0.01);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS', () => {
    it('returns 0', () => {
      const oldState = 0.24948;

      const action = { type: utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS };
      const newState = confirmedBalanceReducer(oldState, action);
      const expectedState = 0;

      expect(newState).toEqual(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = 0.3863846;
      const action = { type: 'UNKNOWN' };
      const newState = confirmedBalanceReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns 0', () => {
      const action = { type: 'UNKNOWN' };
      const newState = confirmedBalanceReducer(undefined, action);

      expect(newState).toEqual(0);
    });
  });
});
