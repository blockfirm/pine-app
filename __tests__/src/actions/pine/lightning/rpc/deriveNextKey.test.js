import {
  deriveNextKey,
  PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY
} from '../../../../../../src/actions/pine/lightning/rpc/deriveNextKey';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: '1e1fc223-3433-456f-a233-ae1a6e5b832f',
      lightning: {
        extendedPublicKey: 'xpub6B6yqFm5ZEWfwiyCsQEVZnV2g2zeLSHeZFKrNxchz9KLjXRSRugfM5C9QF4qnoT69u9Gewd7CNqDKY6FAkbLNu51CsDBsw1RbSfTj1T1KaR'
      }
    }
  }
}));

describe('PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY', () => {
  it('equals "PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY"', () => {
    expect(PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY).toBe('PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY');
  });
});

describe('deriveNextKey', () => {
  it('is a function', () => {
    expect(typeof deriveNextKey).toBe('function');
  });

  it('returns a key descriptor for the next key in the specified key family', () => {
    const request = {
      keyFamily: 2
    };

    expect.hasAssertions();

    return deriveNextKey(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject({
        keyDescriptor: {
          publicKey: Buffer.from('024b7504944fc823a06aea9c1d4e26da50be59ea6c261ed241a140a832117d2e8d', 'hex'),
          keyLocator: { keyFamily: 2, index: 1 }
        }
      });
    });
  });
});
