import * as utxoActions from '../../../../../../src/actions/bitcoin/wallet/utxos';
import utxosErrorReducer from '../../../../../../src/reducers/bitcoin/wallet/utxos/error';

const testRequestAction = (actionType) => {
  it('returns null', () => {
    const oldState = new Error('8703baaa-4891-42b9-9648-70722cdf4511');
    const action = { type: actionType };
    const newState = utxosErrorReducer(oldState, action);

    expect(newState).toBe(null);
  });
};

const testFailureAction = (actionType) => {
  it('returns the error from the action', () => {
    const oldState = new Error('a4070257-e04e-4054-a28a-4d1be343f749');
    const actionError = new Error('f25fee41-c842-45c3-940d-3b5a21e663ed');
    const action = { type: actionType, error: actionError };
    const newState = utxosErrorReducer(oldState, action);

    expect(newState).toBe(actionError);
  });
};

describe('utxosErrorReducer', () => {
  it('is a function', () => {
    expect(typeof utxosErrorReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_REQUEST', () => {
    testRequestAction(utxoActions.BITCOIN_WALLET_UTXOS_LOAD_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_SAVE_REQUEST', () => {
    testRequestAction(utxoActions.BITCOIN_WALLET_UTXOS_SAVE_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_FAILURE', () => {
    testFailureAction(utxoActions.BITCOIN_WALLET_UTXOS_LOAD_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_SAVE_FAILURE', () => {
    testFailureAction(utxoActions.BITCOIN_WALLET_UTXOS_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: '0bddc1ff-0edf-4030-b50d-53cf7eac0379' };
      const action = { type: 'UNKNOWN' };
      const newState = utxosErrorReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = utxosErrorReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
