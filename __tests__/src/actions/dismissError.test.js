import { dismissError, DISMISS_ERROR } from '../../../src/actions/dismissError';

describe('DISMISS_ERROR', () => {
  it('equals "DISMISS_ERROR"', () => {
    expect(DISMISS_ERROR).toBe('DISMISS_ERROR');
  });
});

describe('dismissError', () => {
  it('is a function', () => {
    expect(typeof dismissError).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(dismissError.length).toBe(0);
  });

  it('returns an object with type set to DISMISS_ERROR', () => {
    const returnValue = dismissError();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(DISMISS_ERROR);
  });
});
