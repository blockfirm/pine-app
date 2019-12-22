import { ERROR_HANDLE, ERROR_DISMISS } from '../../../src/actions/error';
import errorReducer from '../../../src/reducers/error';

describe('errorReducer', () => {
  it('is a function', () => {
    expect(typeof errorReducer).toBe('function');
  });

  describe('when action is ERROR_HANDLE', () => {
    it('returns the error', () => {
      const oldState = {};
      const fakeError = new Error('ba915a18-50cd-47d7-bb9e-d53daba85cb0');
      const action = { type: ERROR_HANDLE, error: fakeError };
      const errorState = errorReducer(oldState, action);

      expect(errorState).toBeInstanceOf(Error);
      expect(errorState.message).toBe(fakeError.message);
    });
  });

  describe('when action is ERROR_DISMISS', () => {
    it('returns null', () => {
      const oldState = {};
      const action = { type: ERROR_DISMISS };
      const errorState = errorReducer(oldState, action);

      expect(errorState).toBe(null);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: new Error('cceb0529-c757-4aa7-9e96-4816095416db') };
      const action = { type: 'UNKNOWN' };
      const errorState = errorReducer(oldState, action);

      expect(errorState).toBe(oldState);
    });
  });
});
