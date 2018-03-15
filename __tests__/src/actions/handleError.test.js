import { handleError, HANDLE_ERROR } from '../../../src/actions/handleError';

describe('HANDLE_ERROR', () => {
  it('equals "HANDLE_ERROR"', () => {
    expect(HANDLE_ERROR).toBe('HANDLE_ERROR');
  });
});

describe('handleError', () => {
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
    it('has "type" set to HANDLE_ERROR', () => {
      const returnValue = handleError();
      expect(returnValue.type).toBe(HANDLE_ERROR);
    });

    it('has "error" set to the passed error', () => {
      const fakeError = new Error('fe1b1c6f-fb00-4c69-b88a-576a167d8b8c');
      const returnValue = handleError(fakeError);

      expect(returnValue.error).toBe(fakeError);
    });
  });
});
