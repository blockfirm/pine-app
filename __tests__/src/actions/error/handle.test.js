import { handle as handleError, ERROR_HANDLE } from '../../../../src/actions/error/handle';

describe('ERROR_HANDLE', () => {
  it('equals "ERROR_HANDLE"', () => {
    expect(ERROR_HANDLE).toBe('ERROR_HANDLE');
  });
});

describe('handle', () => {
  it('is a function', () => {
    expect(typeof handleError).toBe('function');
  });

  it('accepts one argument', () => {
    expect(handleError.length).toBe(1);
  });

  it('returns an object', () => {
    const returnValue = handleError();

    expect(typeof returnValue).toBe('object');
    expect(returnValue).toBeTruthy();
  });

  describe('the returned object', () => {
    it('has "type" set to ERROR_HANDLE', () => {
      const returnValue = handleError();
      expect(returnValue.type).toBe(ERROR_HANDLE);
    });

    it('has "error" set to the passed error', () => {
      const fakeError = new Error('fe1b1c6f-fb00-4c69-b88a-576a167d8b8c');
      const returnValue = handleError(fakeError);

      expect(returnValue.error).toBe(fakeError);
    });
  });
});
