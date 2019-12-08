import getAccountKeyPairFromMnemonic from '../../../../../src/clients/paymentServer/crypto/getAccountKeyPairFromMnemonic';
import sign from '../../../../../src/clients/paymentServer/crypto/sign';

describe('sign', () => {
  it('is a function', () => {
    expect(typeof sign).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(sign.length).toBe(2);
  });

  it('returns a signature of the passed message', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const keyPair = getAccountKeyPairFromMnemonic(mnemonic);
    const message = 'bec5dc66-ae17-46c5-9535-ac3505481073';
    const actualSignature = sign(message, keyPair);
    const expectedSignature = 'HxI7fqjULLf8wvMHMCiBR1E0BhX9Xsb/Uh/w3mFDz9pCZdN7Fv8zTjJbFepYVwpH1K3ttxc3ZoQKI5nIo3kNuSc=';

    expect(actualSignature).toEqual(expectedSignature);
  });
});
