import getPublicKeyFromMnemonic from './getPublicKeyFromMnemonic';
import getAccountPublicKeyFromMnemonic from './getAccountPublicKeyFromMnemonic';

const getKeyMetadata = (mnemonic, network, accountIndex) => {
  const publicKey = getPublicKeyFromMnemonic(mnemonic);
  const accountPublicKey = getAccountPublicKeyFromMnemonic(mnemonic, network, accountIndex);

  const metadata = {
    name: 'Default',
    publicKey,
    accountPublicKey
  };

  return metadata;
};

export default getKeyMetadata;
