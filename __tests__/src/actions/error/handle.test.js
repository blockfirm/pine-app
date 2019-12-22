import { handle as handleError, ERROR_HANDLE } from '../../../../src/actions/error/handle';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

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

  it('returns a function', () => {
    const returnValue = handleError();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    it('dispatches an action of type ERROR_HANDLE with the passed error', () => {
      const fakeError = new Error('fe1b1c6f-fb00-4c69-b88a-576a167d8b8c');

      handleError(fakeError)(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ERROR_HANDLE,
        error: fakeError
      });
    });
  });
});
