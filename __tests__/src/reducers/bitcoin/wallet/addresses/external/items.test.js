import * as addressActions from '../../../../../../../src/actions/bitcoin/wallet/addresses';
import * as externalAddressActions from '../../../../../../../src/actions/bitcoin/wallet/addresses/external';
import externalItemsReducer from '../../../../../../../src/reducers/bitcoin/wallet/addresses/external/items';

describe('externalItemsReducer', () => {
  it('is a function', () => {
    expect(typeof externalItemsReducer).toBe('function');
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS', () => {
    it('returns the addresses from the action', () => {
      const oldState = { '2cfe40d0-9748-44e4-aa66-f83b61b5a83e': {} };
      const actionAddresses = { '8d63e318-85e6-4b3d-be16-9b59305674f7': {} };

      const action = {
        type: externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS,
        addresses: actionAddresses
      };

      const newState = externalItemsReducer(oldState, action);

      expect(newState).toBe(actionAddresses);
    });
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_EXTERNAL_ADD_SUCCESS', () => {
    it('returns the old state with the new addresses added', () => {
      const oldState = { '5083126c-d8f8-49e2-887d-81c105044a52': {} };
      const actionAddresses = { '1e2e467a-714e-47fb-ac5f-c091f3f35819': {} };

      const action = {
        type: externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_ADD_SUCCESS,
        addresses: actionAddresses
      };

      const newState = externalItemsReducer(oldState, action);

      const expectedState = {
        '5083126c-d8f8-49e2-887d-81c105044a52': {},
        '1e2e467a-714e-47fb-ac5f-c091f3f35819': {}
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED', () => {
    it('flags the specified addresses as used', () => {
      const oldState = {
        '08bc912e-9953-43cf-a7cc-eb2167a33fb3': { used: true },
        '446f7b42-bef7-4e18-b949-9d25d8c441a5': {},
        'ae248c24-4f6f-463a-a8c0-fc404838eb77': {},
        '6f157eea-d241-4bb0-a4ea-2eacedaf5465': {}
      };

      const expectedState = {
        '08bc912e-9953-43cf-a7cc-eb2167a33fb3': { used: true },
        '446f7b42-bef7-4e18-b949-9d25d8c441a5': { used: true },
        'ae248c24-4f6f-463a-a8c0-fc404838eb77': {},
        '6f157eea-d241-4bb0-a4ea-2eacedaf5465': { used: true }
      };

      const action = {
        type: addressActions.BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED,
        addresses: [
          '446f7b42-bef7-4e18-b949-9d25d8c441a5',
          '6f157eea-d241-4bb0-a4ea-2eacedaf5465'
        ]
      };

      const newState = externalItemsReducer(oldState, action);

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { '403e7072-7587-482a-8fa4-70dd66eb8bad': {} };
      const action = { type: 'UNKNOWN' };
      const newState = externalItemsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = externalItemsReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
