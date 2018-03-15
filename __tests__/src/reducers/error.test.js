import { handleError } from '../../../src/actions/handleError';
import { dismissError } from '../../../src/actions/dismissError';
import errorReducer from '../../../src/reducers/error';

describe('errorReducer', () => {
  it('is a function', () => {
    expect(typeof errorReducer).toBe('function');
  });

  describe('when action is HANDLE_ERROR', () => {
    it('returns the error', () => {
      const oldState = {};
      const fakeError = new Error('ba915a18-50cd-47d7-bb9e-d53daba85cb0');
      const action = handleError(fakeError);
      const errorState = errorReducer(oldState, action);

      expect(errorState).toBeInstanceOf(Error);
      expect(errorState.message).toBe(fakeError.message);
    });
  });

  describe('when action is DISMISS_ERROR', () => {
    it('returns null', () => {
      const oldState = {};
      const action = dismissError();
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
