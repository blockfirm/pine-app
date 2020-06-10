import { unreserve } from '../../../../../src/actions/bitcoin/wallet/utxos/unreserve';

import {
  unlockOutpoint,
  PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT
} from '../../../../../src/actions/lightning/rpc/unlockOutpoint';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

jest.mock('../../../../../src/actions/bitcoin/wallet/utxos/unreserve', () => ({
  unreserve: jest.fn(() => Promise.resolve())
}));

describe('PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT', () => {
  it('equals "PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT"', () => {
    expect(PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT).toBe('PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT');
  });
});

describe('unlockOutpoint', () => {
  it('is a function', () => {
    expect(typeof unlockOutpoint).toBe('function');
  });

  it('unreserves the specified utxo', () => {
    const request = {
      hash: Buffer.from('403f09985102779cb5ccfb528b8deeab42409888731437af15a7720b1d16f9c8', 'hex'),
      index: 1
    };

    expect.hasAssertions();

    return unlockOutpoint(request)(dispatchMock).then(response => {
      expect(response).toMatchObject({});

      expect(unreserve).toHaveBeenCalledWith([{
        txid: 'c8f9161d0b72a715af37147388984042abee8d8b52fbccb59c77025198093f40',
        index: 1
      }]);
    });
  });
});
