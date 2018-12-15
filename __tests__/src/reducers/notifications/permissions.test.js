import { NOTIFICATIONS_SET_PERMISSIONS } from '../../../../src/actions/notifications/setPermissions';
import permissionsReducer from '../../../../src/reducers/notifications/permissions';

describe('permissionsReducer', () => {
  it('is a function', () => {
    expect(typeof permissionsReducer).toBe('function');
  });

  describe('when action is NOTIFICATIONS_SET_PERMISSIONS', () => {
    it('returns permissions from the action', () => {
      const oldState = { badge: 1 };
      const permissions = { badge: 0 };
      const action = { type: NOTIFICATIONS_SET_PERMISSIONS, permissions };
      const newState = permissionsReducer(oldState, action);

      expect(newState).toMatchObject(permissions);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { badge: 1 };
      const permissions = { badge: 0 };
      const action = { type: 'UNKNOWN', permissions };
      const newState = permissionsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = permissionsReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
