import * as utxoActions from '../../../../../src/actions/bitcoin/wallet/utxos';
import balanceReducer from '../../../../../src/reducers/bitcoin/wallet/balance';

describe('balanceReducer', () => {
  it('is a function', () => {
    expect(typeof balanceReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
    it('returns the sum of all utxos', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.10624246 },
        { value: 0.23909878 },
        { value: 1.5992992 }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
        utxos: actionUtxos
      };

      const newState = balanceReducer(oldState, action);

      expect(newState).toBe(1.94464044);
    });
  });

  describe('when action is BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
    it('returns the sum of all utxos', () => {
      const oldState = 0;

      const actionUtxos = [
        { value: 0.00163507 },
        { value: 0.006 },
        { value: 0.00187419 }
      ];

      const action = {
        type: utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
        utxos: actionUtxos
      };

      const newState = balanceReducer(oldState, action);

      expect(newState).toBe(0.00950926);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = 0.3863846;
      const action = { type: 'UNKNOWN' };
      const newState = balanceReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns 0', () => {
      const action = { type: 'UNKNOWN' };
      const newState = balanceReducer(undefined, action);

      expect(newState).toEqual(0);
    });
  });
});
