import * as utxoActions from '../../../../../../src/actions/bitcoin/wallet/utxos';
import utxosReducer from '../../../../../../src/reducers/bitcoin/wallet/utxos';

jest.mock('../../../../../../src/reducers/bitcoin/wallet/utxos/error', () => {
  return jest.fn(() => '0e5bb89a-45db-43eb-ad85-d8e0f7949227');
});

jest.mock('../../../../../../src/reducers/bitcoin/wallet/utxos/items', () => {
  return jest.fn(() => '7d870c5b-d53c-491c-8a87-cb43d7d892ae');
});

const testAction = (actionType) => {
  let newState;

  beforeEach(() => {
    const oldState = {
      attr: 'c59ff986-c9e2-424c-b539-02fa51b72d22',
      error: '829216d2-961e-48b5-8b2a-84ceb4226442',
      items: []
    };

    const action = {
      type: actionType
    };

    newState = utxosReducer(oldState, action);
  });

  it('returns a copy of the old state except error and items', () => {
    expect(typeof newState).toBe('object');
    expect(newState.attr).toBe('c59ff986-c9e2-424c-b539-02fa51b72d22');
  });

  it('sets .error to the return value from error()', () => {
    // This value is mocked at the top.
    expect(newState.error).toBe('0e5bb89a-45db-43eb-ad85-d8e0f7949227');
  });

  it('sets .items to the return value from items()', () => {
    // This value is mocked at the top.
    expect(newState.items).toBe('7d870c5b-d53c-491c-8a87-cb43d7d892ae');
  });
};

describe('utxosReducer', () => {
  it('is a function', () => {
    expect(typeof utxosReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_REQUEST', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_LOAD_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_LOAD_FAILURE', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_LOAD_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_SAVE_REQUEST', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_SAVE_REQUEST);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_SAVE_SUCCESS', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_SAVE_SUCCESS);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_SAVE_FAILURE', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_SAVE_FAILURE);
  });

  describe('when action is BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
    testAction(utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: '58163bd5-42a2-4566-881f-ec86879f13ac' };
      const action = { type: 'UNKNOWN' };
      const newState = utxosReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });
});
