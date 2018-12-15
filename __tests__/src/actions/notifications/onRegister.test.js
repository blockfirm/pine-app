import { onRegister, NOTIFICATIONS_ON_REGISTER } from '../../../../src/actions/notifications/onRegister';

describe('NOTIFICATIONS_ON_REGISTER', () => {
  it('equals "NOTIFICATIONS_ON_REGISTER"', () => {
    expect(NOTIFICATIONS_ON_REGISTER).toBe('NOTIFICATIONS_ON_REGISTER');
  });
});

describe('onRegister', () => {
  it('is a function', () => {
    expect(typeof onRegister).toBe('function');
  });

  it('accepts one argument', () => {
    expect(onRegister.length).toBe(1);
  });

  it('returns an object with type set to NOTIFICATIONS_ON_REGISTER', () => {
    const returnValue = onRegister();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(NOTIFICATIONS_ON_REGISTER);
  });

  it('has .deviceToken set to the passed deviceToken', () => {
    const deviceToken = 'b790e99c-15b7-4766-912f-26bd5ee4b93e';
    const returnValue = onRegister(deviceToken);

    expect(returnValue.deviceToken).toBe(deviceToken);
  });
});
