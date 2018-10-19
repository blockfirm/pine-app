import * as addressActions from '../../../../../../../src/actions/bitcoin/wallet/addresses';
import externalUnusedReducer from '../../../../../../../src/reducers/bitcoin/wallet/addresses/external/unused';

describe('externalUnusedReducer', () => {
  it('is a function', () => {
    expect(typeof externalUnusedReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS', () => {
    describe('when action.internal is false', () => {
      it('returns the action address', () => {
        const oldState = '9e6dc11e-d3b0-4481-830b-2d706ba9d0fe';

        const action = {
          type: addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS,
          address: '2398cb17-51d3-4624-a1f8-ed6063208c27',
          internal: false
        };

        const newState = externalUnusedReducer(oldState, action);

        expect(newState).toBe(action.address);
      });
    });

    describe('when action.internal is true', () => {
      it('returns the old state', () => {
        const oldState = 'c2a5524b-b3c6-40cd-9f3d-94bdbe84b32f';

        const action = {
          type: addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS,
          address: '4fc2baba-8964-4d30-a595-272199fde7e3',
          internal: true
        };

        const newState = externalUnusedReducer(oldState, action);

        expect(newState).toBe(oldState);
      });
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = '45878eb9-b171-4aff-95dd-9efbaa65d37b';
      const action = { type: 'UNKNOWN' };
      const newState = externalUnusedReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = externalUnusedReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
