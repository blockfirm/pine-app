import {
  deriveKey,
  PINE_LIGHTNING_RPC_DERIVE_KEY
} from '../../../../../../src/actions/paymentServer/lightning/rpc/deriveKey';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: 'b0e39d46-2928-4b30-bc2e-a12de7811b50',
      lightning: {
        extendedPublicKey: 'xpub6B6yqFm5ZEWfwiyCsQEVZnV2g2zeLSHeZFKrNxchz9KLjXRSRugfM5C9QF4qnoT69u9Gewd7CNqDKY6FAkbLNu51CsDBsw1RbSfTj1T1KaR'
      }
    }
  }
}));

describe('PINE_LIGHTNING_RPC_DERIVE_KEY', () => {
  it('equals "PINE_LIGHTNING_RPC_DERIVE_KEY"', () => {
    expect(PINE_LIGHTNING_RPC_DERIVE_KEY).toBe('PINE_LIGHTNING_RPC_DERIVE_KEY');
  });
});

describe('deriveKey', () => {
  it('is a function', () => {
    expect(typeof deriveKey).toBe('function');
  });

  it('returns a key descriptor for the specified key locator', () => {
    const request = {
      keyLocator: { keyFamily: 7, index: 0 }
    };

    expect.hasAssertions();

    return deriveKey(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject({
        keyDescriptor: {
          publicKey: Buffer.from('02dd9a94af3be91cb9043c3f3c3ea3e2db405d83c8b6059a6ae94dfe950264be90', 'hex'),
          keyLocator: { keyFamily: 7, index: 0 }
        }
      });
    });
  });
});
