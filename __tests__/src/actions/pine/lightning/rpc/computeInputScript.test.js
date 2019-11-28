import {
  computeInputScript,
  PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT
} from '../../../../../../src/actions/pine/lightning/rpc/computeInputScript';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => require('../../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));
  }

  return action;
});

const getStateMock = jest.fn(() => require('../../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));

jest.mock('../../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('chicken approve topic suit shiver party whale holiday pitch source angry naive'));
});

const transaction = {
  inputs: [
    {
      witness: [],
      transactionHash: Buffer.from('c07b385550902a79cf9cd134eef88c684b2d9a20e6dbfe932411303503518126', 'hex'),
      index: 0,
      signatureScript: Buffer.from([]),
      sequence: 4294967295
    }
  ],
  outputs: [
    {
      value: '100000',
      pkScript: Buffer.from([0, 32, 69, 51, 230, 188, 97, 162, 155, 87, 136, 7, 185, 11, 195, 131, 22, 57, 227, 101, 148, 29, 133, 251, 196, 33, 120, 163, 244, 19, 241, 158, 181, 68])
    },
    {
      value: '4999891213',
      pkScript: Buffer.from([0, 20, 31, 109, 227, 130, 130, 196, 203, 80, 1, 104, 17, 82, 63, 31, 46, 50, 91, 6, 24, 150])
    }
  ],
  version: 1,
  lockTime: 0
};

const signDescriptor = {
  keyDescriptor: {
    keyLocator: {
      keyFamily: 0,
      index: 29
    },
    publicKey: Buffer.from([])
  },
  singleTweak: Buffer.from([]),
  doubleTweak: Buffer.from([]),
  witnessScript: Buffer.from([]),
  output: {
    value: '5000000000',
    pkScript: Buffer.from('a914b9ed0c3bd890627f4d694865dced9075abfca8aa87', 'hex')
  },
  hashType: 1,
  sigHashes: {
    hashPrevOuts: Buffer.from([63, 81, 214, 173, 234, 207, 97, 61, 123, 146, 228, 79, 245, 120, 230, 227, 156, 9, 158, 25, 114, 144, 51, 180, 106, 102, 237, 232, 74, 99, 52, 0]),
    hashSequence: Buffer.from([59, 177, 48, 41, 206, 123, 31, 85, 158, 245, 231, 71, 252, 172, 67, 159, 20, 85, 162, 236, 124, 95, 9, 183, 34, 144, 121, 94, 112, 102, 80, 68]),
    hashOutputs: Buffer.from([59, 101, 38, 131, 65, 171, 244, 117, 11, 232, 29, 206, 60, 96, 182, 55, 79, 253, 43, 246, 56, 122, 114, 99, 245, 60, 251, 110, 21, 136, 75, 120])
  },
  inputIndex: 0
};

describe('PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT', () => {
  it('equals "PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT"', () => {
    expect(PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT).toBe('PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT');
  });
});

describe('computeInputScript', () => {
  it('is a function', () => {
    expect(typeof computeInputScript).toBe('function');
  });

  it('returns an input script', () => {
    const request = {
      transaction,
      signDescriptor
    };

    expect.hasAssertions();

    return computeInputScript(request)(dispatchMock, getStateMock).then(response => {
      expect(response.signatureScript.toString('hex')).toBe(
        '160014bac5f056525e0936bc4f7fe8e6f39c16e5281ea6'
      );
    });
  });
});
