import generateAddress from '../../../../src/crypto/bitcoin/generateAddress';
import { add as addExternalAddress } from '../../../../src/actions/bitcoin/wallet/addresses/external';
import { post as postTransaction } from '../../../../src/actions/bitcoin/blockchain/transactions';
import { getIncoming as getIncomingMessages } from '../../../../src/actions/pine/messages/getIncoming';
import { remove as removeMessageFromServer } from '../../../../src/actions/pine/messages/remove';
import { save as saveContacts } from '../../../../src/actions/contacts/save';
import { add as addMessage } from '../../../../src/actions/messages/add';

import {
  sync as syncMessages,
  MESSAGES_SYNC_REQUEST,
  MESSAGES_SYNC_SUCCESS,
  MESSAGES_SYNC_FAILURE
} from '../../../../src/actions/messages/sync';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        address: 'me@localhost'
      }
    },
    bitcoin: {
      network: 'testnet'
    }
  },
  keys: {
    items: {
      '54404611-8565-46fb-9f59-b28c7ea2c4db': {
        accountPublicKey: ''
      }
    }
  },
  contacts: {
    items: {
      '3631c8a1-d2f9-430f-bd2e-44a889a31836': {
        id: '3631c8a1-d2f9-430f-bd2e-44a889a31836',
        address: 'one@example.org'
      },
      '326e0bcd-66db-45d9-b67c-c55d268362a6': {
        id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
        address: 'two@example.org'
      }
    }
  },
  bitcoin: {
    wallet: {
      addresses: {
        external: {
          items: {
            'ae44bd7b-0465-4d49-825f-03fe47152c65': {
              index: 0,
              used: false
            },
            '2MtLDFUYDLgmnEBJ6B1dZVDKV4EwCnnqcmV': {
              index: 1,
              used: false
            }
          }
        }
      }
    }
  }
}));

jest.mock('../../../../src/crypto/bitcoin/generateAddress', () => {
  return jest.fn((accountPublicKey, network, isInternalAddress, index) => {
    if (index === 4) {
      return '2N7X7BLsDX5CsN4Ds4QfLnnF5S3KriHdKtK';
    }

    return '83e15188-5f3a-4a83-b915-5eb2f3affa72';
  });
});

jest.mock('../../../../src/actions/bitcoin/wallet/addresses/external', () => ({
  add: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/actions/bitcoin/blockchain/transactions', () => ({
  post: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/actions/pine/messages/getIncoming', () => ({
  getIncoming: jest.fn(() => Promise.resolve([
    {
      id: '808eb772-9e44-4f4a-b3e6-ea216b14b3f4',
      version: 1,
      type: 'payment',
      error: null,
      data: {
        transaction: '02000000000102722854c846433f2cfb976a07ea48e032000fb60b1ae02c49c68bd332fbb4296b0000000017160014451cf430aae25ceb0078162ba816cb2f015a2bfdffffffffc345755f498fe674f78b99620131dd7bf3610f2d9b2f11b6df57628b82a63d11000000001716001478430a21a478e675f8bb4358b93c900538792987ffffffff02c33702000000000017a9140be996e81699563dc7c751d8355b14b459c4515187090001000000000017a914391efc1291b2b9990a937ed433f765462eaf1daf8702483045022100ec4043daad5494d7e5ba1983aaa76543221c8fb2abf30a45cfb33c2cc4bf08b5022011a7148dc7efb5194d52c1bc3177f997def39f6544785f14a8135cae16618a400121031c436e384a9c5ccfe515c67b504e07820b1c2e04c6a4bfd4047b685bac1d29d10248304502210083982fe33cae25d830a96151c185544cb0e32872674e44a127d868ced914039902204e7fd7d0a64c01ec0f3ddcbe80cb20a45b7d4575342b9aa8a5555757ae1a80220121035907050a74c5be9b0a8b362c0142cb5210ab2c6bf9ed39a90ff5cf635a2f33a700000000',
        network: 'bitcoin_testnet'
      },
      createdAt: 1558108087,
      from: 'two@example.org'
    },
    {
      id: '3631c8a1-d2f9-430f-bd2e-44a889a31836',
      version: 1,
      type: 'payment',
      error: null,
      data: {
        transaction: '020000000001017f1dc06544d2dccac3bbe8084611cf2b8129cf3618c563d0b4c2db8b5656ca2f00000000171600145ad0f0660a4bbeee6f2b0289976491882ff94427ffffffff02a08601000000000017a9149c92bb7332c75efe79a73e1812b90e6a3b08be3f8717e205000000000017a9148141c4128e50a82ac3dd18cedc61fe6249383004870247304402202fe3b9aade0ef1176df452d309cf43d330e51415c9e27623e5fbd4864c82115b022001a0c9a7f613960068f92dfbaa9ab303ee8e9435ffb1207b23b7f04d54e0a1d101210251cabefddea9ae111079eb33da53d5c29ea7885b4d2e4aa9979ae3e7eb7bbe2b00000000',
        network: 'bitcoin_testnet'
      },
      createdAt: 1558180471,
      from: 'one@example.org'
    }
  ]))
}));

jest.mock('../../../../src/actions/pine/messages/remove', () => ({
  remove: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/actions/messages/add', () => ({
  add: jest.fn(() => Promise.resolve())
}));

describe('MESSAGES_SYNC_REQUEST', () => {
  it('equals "MESSAGES_SYNC_REQUEST"', () => {
    expect(MESSAGES_SYNC_REQUEST).toBe('MESSAGES_SYNC_REQUEST');
  });
});

describe('MESSAGES_SYNC_SUCCESS', () => {
  it('equals "MESSAGES_SYNC_SUCCESS"', () => {
    expect(MESSAGES_SYNC_SUCCESS).toBe('MESSAGES_SYNC_SUCCESS');
  });
});

describe('MESSAGES_SYNC_FAILURE', () => {
  it('equals "MESSAGES_SYNC_FAILURE"', () => {
    expect(MESSAGES_SYNC_FAILURE).toBe('MESSAGES_SYNC_FAILURE');
  });
});

describe('sync', () => {
  beforeEach(() => {
    generateAddress.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
    addExternalAddress.mockClear();
    postTransaction.mockClear();
    getIncomingMessages.mockClear();
    removeMessageFromServer.mockClear();
    saveContacts.mockClear();
    addMessage.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncMessages).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(syncMessages.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = syncMessages();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncMessages();
    });

    it('dispatches an action of type MESSAGES_SYNC_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: MESSAGES_SYNC_REQUEST
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('broadcasts each valid transaction', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(postTransaction).toHaveBeenCalledWith(
            '02000000000102722854c846433f2cfb976a07ea48e032000fb60b1ae02c49c68bd332fbb4296b0000000017160014451cf430aae25ceb0078162ba816cb2f015a2bfdffffffffc345755f498fe674f78b99620131dd7bf3610f2d9b2f11b6df57628b82a63d11000000001716001478430a21a478e675f8bb4358b93c900538792987ffffffff02c33702000000000017a9140be996e81699563dc7c751d8355b14b459c4515187090001000000000017a914391efc1291b2b9990a937ed433f765462eaf1daf8702483045022100ec4043daad5494d7e5ba1983aaa76543221c8fb2abf30a45cfb33c2cc4bf08b5022011a7148dc7efb5194d52c1bc3177f997def39f6544785f14a8135cae16618a400121031c436e384a9c5ccfe515c67b504e07820b1c2e04c6a4bfd4047b685bac1d29d10248304502210083982fe33cae25d830a96151c185544cb0e32872674e44a127d868ced914039902204e7fd7d0a64c01ec0f3ddcbe80cb20a45b7d4575342b9aa8a5555757ae1a80220121035907050a74c5be9b0a8b362c0142cb5210ab2c6bf9ed39a90ff5cf635a2f33a700000000'
          );

          expect(postTransaction).toHaveBeenCalledWith(
            '020000000001017f1dc06544d2dccac3bbe8084611cf2b8129cf3618c563d0b4c2db8b5656ca2f00000000171600145ad0f0660a4bbeee6f2b0289976491882ff94427ffffffff02a08601000000000017a9149c92bb7332c75efe79a73e1812b90e6a3b08be3f8717e205000000000017a9148141c4128e50a82ac3dd18cedc61fe6249383004870247304402202fe3b9aade0ef1176df452d309cf43d330e51415c9e27623e5fbd4864c82115b022001a0c9a7f613960068f92dfbaa9ab303ee8e9435ffb1207b23b7f04d54e0a1d101210251cabefddea9ae111079eb33da53d5c29ea7885b4d2e4aa9979ae3e7eb7bbe2b00000000'
          );
        });
      });

      it('removes each message from server', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(removeMessageFromServer).toHaveBeenCalledWith(expect.objectContaining({
            id: '808eb772-9e44-4f4a-b3e6-ea216b14b3f4' // Mocked value.
          }));

          expect(removeMessageFromServer).toHaveBeenCalledWith(expect.objectContaining({
            id: '3631c8a1-d2f9-430f-bd2e-44a889a31836' // Mocked value.
          }));
        });
      });

      it('saves existing and new addresses as used', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(addExternalAddress).toHaveBeenCalledWith(expect.objectContaining({
            '2MtLDFUYDLgmnEBJ6B1dZVDKV4EwCnnqcmV': {
              index: 1,
              used: true
            },
            '2N7X7BLsDX5CsN4Ds4QfLnnF5S3KriHdKtK': {
              index: 4,
              used: true
            }
          }));
        });
      });

      it('dispatches an action of type MESSAGES_SYNC_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: MESSAGES_SYNC_SUCCESS
          });
        });
      });

      it('saves the state', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(saveContacts).toHaveBeenCalled();
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from getIncomingMessages().
        getIncomingMessages.mockImplementationOnce(() => Promise.reject(
          new Error('46e45622-e986-46f7-ba61-b9db3041d5c6')
        ));

        promise = syncMessages()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('46e45622-e986-46f7-ba61-b9db3041d5c6');
        });
      });

      it('dispatches an action of type MESSAGES_SYNC_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: MESSAGES_SYNC_FAILURE,
            error
          });
        });
      });
    });
  });
});
