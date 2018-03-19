import { dismiss as dismissError, ERROR_DISMISS } from '../../../../src/actions/error/dismiss';

describe('ERROR_DISMISS', () => {
  it('equals "ERROR_DISMISS"', () => {
    expect(ERROR_DISMISS).toBe('ERROR_DISMISS');
  });
});

describe('dismiss', () => {
  it('is a function', () => {
    expect(typeof dismissError).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(dismissError.length).toBe(0);
  });

  it('returns an object with type set to ERROR_DISMISS', () => {
    const returnValue = dismissError();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(ERROR_DISMISS);
  });
});
