import * as keysActions from '../../../../src/actions/keys';
import keysItemsReducer from '../../../../src/reducers/keys/items';

describe('keysItemsReducer', () => {
  it('is a function', () => {
    expect(typeof keysItemsReducer).toBe('function');
  });

  describe('when action is KEYS_LOAD_SUCCESS', () => {
    it('returns the keys from the action', () => {
      const oldState = { attr: '2cfe40d0-9748-44e4-aa66-f83b61b5a83e' };
      const actionKeys = { attr: '8d63e318-85e6-4b3d-be16-9b59305674f7' };
      const action = { type: keysActions.KEYS_LOAD_SUCCESS, keys: actionKeys };
      const newState = keysItemsReducer(oldState, action);

      expect(newState).toBe(actionKeys);
    });
  });

  describe('when action is KEYS_ADD_SUCCESS', () => {
    it('returns the keys with the new key added', () => {
      const oldState = { '5083126c-d8f8-49e2-887d-81c105044a52': {} };
      const actionKey = { id: '1e2e467a-714e-47fb-ac5f-c091f3f35819' };
      const action = { type: keysActions.KEYS_ADD_SUCCESS, key: actionKey };
      const newState = keysItemsReducer(oldState, action);

      const expectedState = {
        '5083126c-d8f8-49e2-887d-81c105044a52': {},
        '1e2e467a-714e-47fb-ac5f-c091f3f35819': {}
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is KEYS_REMOVE_SUCCESS', () => {
    it('returns the keys with the key removed', () => {
      const oldState = {
        'cf8d2082-a44a-495e-86b8-670030eacbcc': {},
        '1918bca9-8181-4a45-9641-3d412fb8767c': {}
      };

      const actionKey = { id: 'cf8d2082-a44a-495e-86b8-670030eacbcc' };
      const action = { type: keysActions.KEYS_REMOVE_SUCCESS, key: actionKey };
      const newState = keysItemsReducer(oldState, action);

      const expectedState = {
        '1918bca9-8181-4a45-9641-3d412fb8767c': {}
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { keys: '403e7072-7587-482a-8fa4-70dd66eb8bad' };
      const action = { type: 'UNKNOWN' };
      const newState = keysItemsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = keysItemsReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
