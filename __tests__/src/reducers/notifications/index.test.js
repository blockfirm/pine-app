import notificationsReducer from '../../../../src/reducers/notifications';

jest.mock('../../../../src/reducers/notifications/deviceToken', () => {
  return jest.fn(() => '82056f55-2bc3-4735-a9a3-13c508649616');
});

jest.mock('../../../../src/reducers/notifications/permissions', () => {
  return jest.fn(() => '563fd159-43d5-4f11-8c1a-86bb03f53ab5');
});

describe('notificationsReducer', () => {
  let newState;

  beforeEach(() => {
    const oldState = {
      deviceToken: '0489d818-ba1c-48bf-9a6b-58f81b227fdf',
      permissions: '8d085e01-4fb4-4552-930b-210b3efb0137'
    };

    const action = {
      type: 'NOTIFICATIONS_ON_REGISTER'
    };

    newState = notificationsReducer(oldState, action);
  });

  it('is a function', () => {
    expect(typeof notificationsReducer).toBe('function');
  });

  it('sets .deviceToken to the return value from deviceToken()', () => {
    // This value is mocked at the top.
    expect(newState.deviceToken).toBe('82056f55-2bc3-4735-a9a3-13c508649616');
  });

  it('sets .permissions to the return value from permissions()', () => {
    // This value is mocked at the top.
    expect(newState.permissions).toBe('563fd159-43d5-4f11-8c1a-86bb03f53ab5');
  });
});
