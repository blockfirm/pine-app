import {
  signOutputRaw,
  PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW
} from '../../../../../../src/actions/pine/lightning/rpc/signOutputRaw';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  keys: {
    items: {
      '156d4d5d-9ba7-4c0a-aad3-0c3ab4f4484b': {
        id: '156d4d5d-9ba7-4c0a-aad3-0c3ab4f4484b'
      }
    }
  },
  settings: {
    bitcoin: {
      network: 'testnet'
    }
  }
}));

jest.mock('../../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('abandon category occur glad square empower half chef door puzzle sauce begin coral text drive clarify always kid lizard piano dentist canyon practice together'));
});

const transaction = {
  inputs: [
    {
      witness: [],
      transactionHash: Buffer.from('93ba4f5a19572a8db0b4c48d5c5ed6e69593a9ecd7a764c5cc44875cb823407b', 'hex'),
      index: 0,
      signatureScript: Buffer.from(''),
      sequence: 2152256123
    }
  ],
  outputs: [
    {
      value: '90950',
      pkScript: Buffer.from('0014a9d2db3875372451bb69011b11104e948875bda4', 'hex')
    }
  ],
  version: 2,
  lockTime: 539051172
};

const signDescriptor = {
  keyDescriptor: {
    keyLocator: {
      keyFamily: 0,
      index: 1
    },
    publicKey: Buffer.from('048154cde5c5233b057c1c9ec38c96cc28f49b31cfd80e013a5afd9587784fccde3948d556ce55d9f2bd311ed1258ccbfa220708208eff99f1f442ae3006a753f8', 'hex')
  },
  singleTweak: Buffer.from(''),
  doubleTweak: Buffer.from(''),
  witnessScript: Buffer.from('5221021b9d2e452a006c7b252ce72a02179c4ba13315c2bb7725cb96e4faed03da85b021028154cde5c5233b057c1c9ec38c96cc28f49b31cfd80e013a5afd9587784fccde52ae', 'hex'),
  output: {
    value: '100000',
    pkScript: Buffer.from('002037d5877426b65737d28ffa239982c876cbfca12d4c1889fb5218c322c632c357', 'hex')
  },
  hashType: 1,
  sigHashes: {
    hashPrevOuts: Buffer.from('d3cd535476457aedcdb08007a7d094a57fa1856eeb664e42d6353ba40c9f9e57', 'hex'),
    hashSequence: Buffer.from('8cd360f20ae160bd571b69d543e36282f13508922045ce03979c8b2be7f7714f', 'hex'),
    hashOutputs: Buffer.from('c5ab74239a9bda7fb897ff0c1ae12ae0e053c0877febdc1e3b49a149fdf18c41', 'hex')
  },
  inputIndex: 0
};

describe('PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW', () => {
  it('equals "PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW"', () => {
    expect(PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW).toBe('PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW');
  });
});

describe('signOutputRaw', () => {
  it('is a function', () => {
    expect(typeof signOutputRaw).toBe('function');
  });

  it('returns a signature', () => {
    const request = {
      transaction,
      signDescriptor
    };

    expect.hasAssertions();

    return signOutputRaw(request)(dispatchMock, getStateMock).then(response => {
      expect(response.signature.toString('hex')).toBe(
        '3045022100db4b697ef1df74b56ef9c9d5f8265ec4cdaa4fc6472272c868528bb5059d518402205c5e87c2867be96a745995a6d9ddb719e6bb3608cab3f35770c4d369dfaa4342'
      );
    });
  });
});
