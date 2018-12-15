import { onRegisterError, NOTIFICATIONS_ON_REGISTER_ERROR } from '../../../../src/actions/notifications/onRegisterError';

describe('NOTIFICATIONS_ON_REGISTER_ERROR', () => {
  it('equals "NOTIFICATIONS_ON_REGISTER_ERROR"', () => {
    expect(NOTIFICATIONS_ON_REGISTER_ERROR).toBe('NOTIFICATIONS_ON_REGISTER_ERROR');
  });
});

describe('onRegisterError', () => {
  it('is a function', () => {
    expect(typeof onRegisterError).toBe('function');
  });

  it('accepts one argument', () => {
    expect(onRegisterError.length).toBe(1);
  });

  it('returns an object with type set to NOTIFICATIONS_ON_REGISTER_ERROR', () => {
    const returnValue = onRegisterError();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(NOTIFICATIONS_ON_REGISTER_ERROR);
  });

  it('has .error set to the passed error', () => {
    const error = 'c957472a-189c-4145-835f-fcbea576f1e3';
    const returnValue = onRegisterError(error);

    expect(returnValue.error).toBe(error);
  });
});
