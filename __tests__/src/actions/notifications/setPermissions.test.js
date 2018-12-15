import { setPermissions, NOTIFICATIONS_SET_PERMISSIONS } from '../../../../src/actions/notifications/setPermissions';

describe('NOTIFICATIONS_SET_PERMISSIONS', () => {
  it('equals "NOTIFICATIONS_SET_PERMISSIONS"', () => {
    expect(NOTIFICATIONS_SET_PERMISSIONS).toBe('NOTIFICATIONS_SET_PERMISSIONS');
  });
});

describe('setPermissions', () => {
  it('is a function', () => {
    expect(typeof setPermissions).toBe('function');
  });

  it('accepts one argument', () => {
    expect(setPermissions.length).toBe(1);
  });

  it('returns an object with type set to NOTIFICATIONS_SET_PERMISSIONS', () => {
    const returnValue = setPermissions();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(NOTIFICATIONS_SET_PERMISSIONS);
  });

  it('has .permissions set to the passed error', () => {
    const permissions = '2706fe07-9d02-4c56-9ee7-cf87022bec29';
    const returnValue = setPermissions(permissions);

    expect(returnValue.permissions).toBe(permissions);
  });
});
