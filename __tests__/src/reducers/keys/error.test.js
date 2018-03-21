import * as keysActions from '../../../../src/actions/keys';
import keysErrorReducer from '../../../../src/reducers/keys/error';

const testRequestAction = (actionType) => {
  it('returns null', () => {
    const oldState = new Error('9752d6f9-7292-493e-aedb-3fae703511c8');
    const action = { type: actionType };
    const newState = keysErrorReducer(oldState, action);

    expect(newState).toBe(null);
  });
};

const testFailureAction = (actionType) => {
  it('returns the error from the action', () => {
    const oldState = new Error('92817eca-5749-4a66-9b78-4a8cbdff8fa4');
    const actionError = new Error('8884ac2e-77c6-44eb-8b94-f3ff551d9f3c');
    const action = { type: actionType, error: actionError };
    const newState = keysErrorReducer(oldState, action);

    expect(newState).toBe(actionError);
  });
};

describe('keysErrorReducer', () => {
  it('is a function', () => {
    expect(typeof keysErrorReducer).toBe('function');
  });

  describe('when action is KEYS_ADD_REQUEST', () => {
    testRequestAction(keysActions.KEYS_ADD_REQUEST);
  });

  describe('when action is KEYS_LOAD_REQUEST', () => {
    testRequestAction(keysActions.KEYS_LOAD_REQUEST);
  });

  describe('when action is KEYS_REMOVE_REQUEST', () => {
    testRequestAction(keysActions.KEYS_REMOVE_REQUEST);
  });

  describe('when action is KEYS_SAVE_REQUEST', () => {
    testRequestAction(keysActions.KEYS_SAVE_REQUEST);
  });

  describe('when action is KEYS_LOAD_FAILURE', () => {
    testFailureAction(keysActions.KEYS_LOAD_FAILURE);
  });

  describe('when action is KEYS_REMOVE_FAILURE', () => {
    testFailureAction(keysActions.KEYS_REMOVE_FAILURE);
  });

  describe('when action is KEYS_SAVE_FAILURE', () => {
    testFailureAction(keysActions.KEYS_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: 'd8875447-701f-421c-9df0-559b8fca2bb7' };
      const action = { type: 'UNKNOWN' };
      const newState = keysErrorReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = keysErrorReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
