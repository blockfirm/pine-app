import * as internetActions from '../../../../src/actions/network/internet';
import internetReducer from '../../../../src/reducers/network/internet';

describe('internetReducer', () => {
  it('is a function', () => {
    expect(typeof internetReducer).toBe('function');
  });

  describe('when action is NETWORK_INTERNET_DISCONNECTED', () => {
    it('returns an object with disconnected set to true', () => {
      const oldState = { disconnected: false };
      const action = { type: internetActions.NETWORK_INTERNET_DISCONNECTED };
      const newState = internetReducer(oldState, action);

      const expectedState = {
        disconnected: true
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is NETWORK_INTERNET_CONNECTED', () => {
    it('returns an object with disconnected set to false', () => {
      const oldState = { disconnected: true };
      const action = { type: internetActions.NETWORK_INTERNET_CONNECTED };
      const newState = internetReducer(oldState, action);

      const expectedState = {
        disconnected: false
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { disconnected: '9c549054-0afb-444a-942e-7f1e9d354814' };
      const action = { type: 'UNKNOWN' };
      const newState = internetReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = internetReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
