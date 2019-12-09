import {
  PINE_CONTACT_REQUESTS_GET_SUCCESS,
  PINE_CONTACT_REQUESTS_GET_FAILURE
} from '../../../../src/actions/paymentServer/contactRequests/get';

import pineReducer from '../../../../src/reducers/network/pine';

describe('pineReducer', () => {
  it('is a function', () => {
    expect(typeof pineReducer).toBe('function');
  });

  describe('when action is PINE_CONTACT_REQUESTS_GET_SUCCESS', () => {
    it('returns an object with disconnected set to false', () => {
      const oldState = { disconnected: true };
      const action = { type: PINE_CONTACT_REQUESTS_GET_SUCCESS };
      const newState = pineReducer(oldState, action);

      const expectedState = {
        disconnected: false
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is PINE_CONTACT_REQUESTS_GET_FAILURE', () => {
    it('returns an object with disconnected set to true', () => {
      const oldState = { disconnected: false };
      const action = { type: PINE_CONTACT_REQUESTS_GET_FAILURE };
      const newState = pineReducer(oldState, action);

      const expectedState = {
        disconnected: true
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { disconnected: '924b54ee-d846-4367-9082-bb1f79e3e6d8' };
      const action = { type: 'UNKNOWN' };
      const newState = pineReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = pineReducer(undefined, action);

      expect(newState).toEqual({});
    });
  });
});
