import * as keysActions from '../../../../src/actions/keys';
import keysReducer from '../../../../src/reducers/keys';

jest.mock('../../../../src/reducers/keys/error', () => {
  return jest.fn(() => 'c7ca2f7b-0b0d-4744-b65a-1615e363c572');
});

jest.mock('../../../../src/reducers/keys/items', () => {
  return jest.fn(() => 'af809498-7ab1-43d9-8d73-196fbf16e23c');
});

const testAction = (actionType) => {
  let newState;

  beforeEach(() => {
    const oldState = {
      attr: '0aa0bd80-af8d-48c4-9a69-92a4bb30010e',
      error: '829216d2-961e-48b5-8b2a-84ceb4226442',
      items: []
    };

    const action = {
      type: actionType
    };

    newState = keysReducer(oldState, action);
  });

  it('returns a copy of the old state except error and items', () => {
    expect(typeof newState).toBe('object');
    expect(newState.attr).toBe('0aa0bd80-af8d-48c4-9a69-92a4bb30010e');
  });

  it('sets .error to the return value from error()', () => {
    // This value is mocked at the top.
    expect(newState.error).toBe('c7ca2f7b-0b0d-4744-b65a-1615e363c572');
  });

  it('sets .items to the return value from items()', () => {
    // This value is mocked at the top.
    expect(newState.items).toBe('af809498-7ab1-43d9-8d73-196fbf16e23c');
  });
};

describe('keysReducer', () => {
  it('is a function', () => {
    expect(typeof keysReducer).toBe('function');
  });

  describe('when action is KEYS_ADD_REQUEST', () => {
    testAction(keysActions.KEYS_ADD_REQUEST);
  });

  describe('when action is KEYS_ADD_SUCCESS', () => {
    testAction(keysActions.KEYS_ADD_SUCCESS);
  });

  describe('when action is KEYS_LOAD_REQUEST', () => {
    testAction(keysActions.KEYS_LOAD_REQUEST);
  });

  describe('when action is KEYS_LOAD_SUCCESS', () => {
    testAction(keysActions.KEYS_LOAD_SUCCESS);
  });

  describe('when action is KEYS_LOAD_FAILURE', () => {
    testAction(keysActions.KEYS_LOAD_FAILURE);
  });

  describe('when action is KEYS_REMOVE_REQUEST', () => {
    testAction(keysActions.KEYS_REMOVE_REQUEST);
  });

  describe('when action is KEYS_REMOVE_SUCCESS', () => {
    testAction(keysActions.KEYS_REMOVE_SUCCESS);
  });

  describe('when action is KEYS_REMOVE_FAILURE', () => {
    testAction(keysActions.KEYS_REMOVE_FAILURE);
  });

  describe('when action is KEYS_SAVE_REQUEST', () => {
    testAction(keysActions.KEYS_SAVE_REQUEST);
  });

  describe('when action is KEYS_SAVE_SUCCESS', () => {
    testAction(keysActions.KEYS_SAVE_SUCCESS);
  });

  describe('when action is KEYS_SAVE_FAILURE', () => {
    testAction(keysActions.KEYS_SAVE_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: 'c6bf4167-eeaa-4da1-8a04-0c88da8027af' };
      const action = { type: 'UNKNOWN' };
      const newState = keysReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });
});
