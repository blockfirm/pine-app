import * as utxoActions from '../../../../../src/actions/bitcoin/wallet/utxos';
import spendableBalanceReducer from '../../../../../src/reducers/bitcoin/wallet/spendableBalance';

describe('spendableBalanceReducer', () => {
  it('is a function', () => {
    expect(typeof spendableBalanceReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
    it('returns the sum of all confirmed utxos and unconfirmed change', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.10624246, confirmed: true, internal: true },
        { value: 0.23909878, confirmed: false, internal: false },
        { value: 1.5992992, confirmed: false, internal: true }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
        utxos: actionUtxos
      };

      const newState = spendableBalanceReducer(oldState, action);

      expect(newState).toBe(1.70554166);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
    it('returns the sum of all confirmed utxos and unconfirmed change', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.00163507, confirmed: false, internal: false },
        { value: 0.006, confirmed: true, internal: false },
        { value: 0.004, confirmed: false, internal: true },
        { value: 0.00187419, confirmed: false, internal: false }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
        utxos: actionUtxos
      };

      const newState = spendableBalanceReducer(oldState, action);

      expect(newState).toBe(0.01);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = 0.3863846;
      const action = { type: 'UNKNOWN' };
      const newState = spendableBalanceReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns 0', () => {
      const action = { type: 'UNKNOWN' };
      const newState = spendableBalanceReducer(undefined, action);

      expect(newState).toEqual(0);
    });
  });
});
