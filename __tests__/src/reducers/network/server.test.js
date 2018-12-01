import { BITCOIN_WALLET_SYNC_SUCCESS, BITCOIN_WALLET_SYNC_FAILURE } from '../../../../src/actions/bitcoin/wallet/sync';
import { NETWORK_SERVER_GET_INFO_SUCCESS, NETWORK_SERVER_GET_INFO_FAILURE } from '../../../../src/actions/network/server/getInfo';
import serverReducer from '../../../../src/reducers/network/server';

describe('serverReducer', () => {
  it('is a function', () => {
    expect(typeof serverReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_SYNC_FAILURE', () => {
    it('returns an object with disconnected set to true', () => {
      const oldState = { disconnected: false };
      const action = { type: BITCOIN_WALLET_SYNC_FAILURE };
      const newState = serverReducer(oldState, action);

      const expectedState = {
        disconnected: true
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is BITCOIN_WALLET_SYNC_SUCCESS', () => {
    it('returns an object with disconnected set to false', () => {
      const oldState = { disconnected: true };
      const action = { type: BITCOIN_WALLET_SYNC_SUCCESS };
      const newState = serverReducer(oldState, action);

      const expectedState = {
        disconnected: false
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is NETWORK_SERVER_GET_INFO_SUCCESS', () => {
    it('returns an object with info set to info from the action', () => {
      const oldState = {};
      const info = { test: 'a703933b-d320-4e54-ba99-87826fe02b7a' };
      const action = { type: NETWORK_SERVER_GET_INFO_SUCCESS, info };
      const newState = serverReducer(oldState, action);
      const expectedState = { info };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is NETWORK_SERVER_GET_INFO_FAILURE', () => {
    it('returns an object with info set to null', () => {
      const info = { test: 'fd92ce8c-696e-4938-93f8-8b01c54aff47' };
      const oldState = { info };
      const action = { type: NETWORK_SERVER_GET_INFO_FAILURE };
      const newState = serverReducer(oldState, action);
      const expectedState = { info: null };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { disconnected: '32feab78-fa6e-4970-bf38-9897d8b847a4' };
      const action = { type: 'UNKNOWN' };
      const newState = serverReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = serverReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
