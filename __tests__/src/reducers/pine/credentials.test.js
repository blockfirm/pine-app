import { PINE_CREDENTIALS_LOAD_SUCCESS } from '../../../../src/actions/pine/credentials';
import credentialsReducer from '../../../../src/reducers/pine/credentials';

describe('credentialsReducer', () => {
  it('is a function', () => {
    expect(typeof credentialsReducer).toBe('function');
  });

  describe('when action is PINE_CREDENTIALS_LOAD_SUCCESS', () => {
    it('returns the credentials from the action', () => {
      const oldState = null;
      const credentials = { userId: '3738ff78-141b-45d9-b933-5fe5d3688743' };
      const action = { type: PINE_CREDENTIALS_LOAD_SUCCESS, credentials };
      const credentialsState = credentialsReducer(oldState, action);

      expect(credentialsState).toBe(credentials);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { userId: '8da45961-8aec-49a1-b183-ab1000541db2' };
      const action = { type: 'UNKNOWN' };
      const credentialsState = credentialsReducer(oldState, action);

      expect(credentialsState).toBe(oldState);
    });
  });
});
