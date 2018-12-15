import { NOTIFICATIONS_ON_REGISTER } from '../../../../src/actions/notifications/onRegister';
import deviceTokenReducer from '../../../../src/reducers/notifications/deviceToken';

describe('deviceTokenReducer', () => {
  it('is a function', () => {
    expect(typeof deviceTokenReducer).toBe('function');
  });

  describe('when action is NOTIFICATIONS_ON_REGISTER', () => {
    it('returns deviceToken from the action', () => {
      const oldState = 'a99b50be-50d5-49c1-a386-917912dbeecf';
      const deviceToken = '49a0b632-2fe5-4605-991c-da42b9b0f507';
      const action = { type: NOTIFICATIONS_ON_REGISTER, deviceToken };
      const newState = deviceTokenReducer(oldState, action);

      expect(newState).toBe(deviceToken);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = '8259bf69-ac0f-4791-acf7-6ca59374312b';
      const deviceToken = 'c09ab56e-a92c-4073-a274-341c7b66c69a';
      const action = { type: 'UNKNOWN', deviceToken };
      const newState = deviceTokenReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = deviceTokenReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
