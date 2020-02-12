import {
  signMessage,
  PINE_LIGHTNING_RPC_SIGN_MESSAGE
} from '../../../../../src/actions/lightning/rpc/signMessage';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  keys: {
    items: {
      '3974521b-9aeb-4682-9466-1389e591526a': {
        id: '3974521b-9aeb-4682-9466-1389e591526a'
      }
    }
  },
  settings: {
    bitcoin: {
      network: 'testnet'
    }
  }
}));

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('chicken approve topic suit shiver party whale holiday pitch source angry naive'));
});

describe('PINE_LIGHTNING_RPC_SIGN_MESSAGE', () => {
  it('equals "PINE_LIGHTNING_RPC_SIGN_MESSAGE"', () => {
    expect(PINE_LIGHTNING_RPC_SIGN_MESSAGE).toBe('PINE_LIGHTNING_RPC_SIGN_MESSAGE');
  });
});

describe('signMessage', () => {
  it('is a function', () => {
    expect(typeof signMessage).toBe('function');
  });

  it('returns a signature of the passed message', () => {
    const request = {
      message: Buffer.from('5081c4d5-b842-4b43-961f-6434f7927e0b'),
      publicKey: Buffer.from('04a43ef2516a102783d8e8e87c95bd334e38c78ad49f3a07aa27bbb621e509617f0089fd39af4305d138ff2df4550ce4c9fb45f2036a78edffc370ecfe8ad697b9', 'hex')
    };

    const expectedSignature = Buffer.from('3043021f095a44fda53d7f5d763db37a00a55fcd3964808293fe91a7b880bff3f9271d02201784b6bad67a64d08e971d15a2aeb7e8b36401bc3b329b441168faad289d5f60', 'hex');

    return signMessage(request)(dispatchMock, getStateMock).then(response => {
      expect(response.signature.equals(expectedSignature)).toBe(true);
    });
  });
});
