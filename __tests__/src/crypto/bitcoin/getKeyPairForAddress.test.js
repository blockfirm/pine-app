import getKeyPairForAddress from '../../../../src/crypto/bitcoin/getKeyPairForAddress';

const addresses = {
  external: {
    items: {
      'e974e67e-55fd-420a-a164-dc58ef6a079c': {
        index: 0
      }
    }
  },
  internal: {
    items: {
      '6d5e7427-b279-4e84-8892-8b22e8478591': {
        index: 1
      }
    }
  }
};

describe('getKeyPairForAddress', () => {
  it('is a function', () => {
    expect(typeof getKeyPairForAddress).toBe('function');
  });

  it('accepts four arguments', () => {
    expect(getKeyPairForAddress.length).toBe(4);
  });

  describe('external address', () => {
    it('returns the key pair for the passed address', () => {
      const address = 'e974e67e-55fd-420a-a164-dc58ef6a079c';
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const network = 'testnet';
      const keyPair = getKeyPairForAddress(address, addresses, mnemonic, network);

      expect(typeof keyPair).toBe('object');
      expect(keyPair.privateKey.toString('hex')).toBe('a36c918997d8041461f7b8b7c8c6dcecd11625b575801544db44847920dfa237');
      expect(keyPair.publicKey.toString('hex')).toBe('03344d87c6c62b03d935e5c365a9ef8b2ea96b246aae8360711efa6a00838a6963');
    });
  });

  describe('internal address', () => {
    it('returns the key pair for the passed address', () => {
      const address = '6d5e7427-b279-4e84-8892-8b22e8478591';
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const network = 'testnet';
      const keyPair = getKeyPairForAddress(address, addresses, mnemonic, network);

      expect(typeof keyPair).toBe('object');
      expect(keyPair.privateKey.toString('hex')).toBe('21265d2685d75b794c8996c86a91a16767cf75d48680acb80d85f029cda66d16');
      expect(keyPair.publicKey.toString('hex')).toBe('031d5d25a3096ae62643fc33df7f584901aa9b3dc8700de8c9ffd67d41fb6ac8c2');
    });
  });

  describe('unknown address', () => {
    it('returns undefined', () => {
      const address = '7d44759e-73aa-4bf7-93e3-67072421c440';
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const network = 'testnet';
      const keyPair = getKeyPairForAddress(address, addresses, mnemonic, network);

      expect(keyPair).toBeUndefined();
    });
  });
});
