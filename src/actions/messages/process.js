import bitcoin from 'bitcoinjs-lib';
import generateAddress from '../../crypto/bitcoin/generateAddress';
import { convert as convertAmount, UNIT_BTC, UNIT_SATOSHIS } from '../../crypto/bitcoin/convert';

export const MESSAGES_PROCESS_REQUEST = 'MESSAGES_PROCESS_REQUEST';
export const MESSAGES_PROCESS_SUCCESS = 'MESSAGES_PROCESS_SUCCESS';
export const MESSAGES_PROCESS_FAILURE = 'MESSAGES_PROCESS_FAILURE';

const MESSAGE_TYPE_PAYMENT = 'payment';

const processRequest = () => {
  return {
    type: MESSAGES_PROCESS_REQUEST
  };
};

const processSuccess = (processedMessage) => {
  return {
    type: MESSAGES_PROCESS_SUCCESS,
    processedMessage
  };
};

const processFailure = (error) => {
  return {
    type: MESSAGES_PROCESS_FAILURE,
    error
  };
};

const validateMessage = (message, network) => {
  if (!message || typeof message !== 'object') {
    throw new Error('Message must be an object');
  }

  if (message.version !== 1) {
    throw new Error('Message version must be 1');
  }

  if (message.type !== MESSAGE_TYPE_PAYMENT) {
    throw new Error('Message type must be payment');
  }

  if (!message.data || typeof message.data !== 'object') {
    throw new Error('Message data must be an object');
  }

  if (typeof message.data.transaction !== 'string') {
    throw new Error('Message transaction must be a string');
  }

  if (message.data.network !== `bitcoin_${network}`) {
    throw new Error(`Message network must be bitcoin_${network}`);
  }

  return true;
};

const findWalletAddress = (address, network, externalAddresses, accountPublicKey) => {
  const isInternalAddress = false;

  // Look in already existing addresses.
  if (Object.keys(externalAddresses).includes(address)) {
    return {
      ...externalAddresses[address],
      address
    };
  }

  const lastAddressIndex = Object.values(externalAddresses).reduce((max, externalAddress) => {
    return Math.max(max, externalAddress.index);
  }, -1);

  // Look if address is in the next 50 addresses.
  for (let i = 1; i <= 50; i++) {
    const newAddress = generateAddress(accountPublicKey, network, isInternalAddress, lastAddressIndex + i);

    if (newAddress === address) {
      return {
        index: lastAddressIndex + i,
        address
      };
    }
  }

  return null;
};

const getAddressesFromTransaction = (transaction, network) => {
  const bitcoinNetwork = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.mainnet;

  const addresses = transaction.outs
    .map((out) => {
      try {
        const address = bitcoin.address.fromOutputScript(out.script, bitcoinNetwork);
        return { address, out };
      } catch (error) {
        return null;
      }
    })
    .filter((address) => address);

  return addresses;
};

/**
 * Action to process an incoming message.
 *
 * @param {Object} message - Message to process.
 * @param {string} message.id - ID of the message.
 * @param {number} message.version - Version of the structure. Must be set to 1.
 * @param {string} message.type - Type of the message. Must be set to 'payment'.
 * @param {Object} message.data - Message data.
 * @param {string} message.data.transaction - Raw serialized bitcoin transaction.
 * @param {string} message.data.network - Network the transaction is for. Must be either 'bitcoin_testnet' or 'bitcoin_mainnet'.
 *
 * @returns {Promise.Object} A promise that resolves to the processed message.
 */
export const process = (message) => {
  return (dispatch, getState) => {
    dispatch(processRequest());

    return Promise.resolve()
      .then(() => {
        const state = getState();
        const { network } = state.settings.bitcoin;
        const key = Object.values(state.keys.items)[0];
        const { accountPublicKey } = key;
        const externalAddresses = state.bitcoin.wallet.addresses.external.items;

        validateMessage(message, network);

        const rawTransaction = message.data.transaction;
        const transaction = bitcoin.Transaction.fromHex(rawTransaction);
        const addresses = getAddressesFromTransaction(transaction, network);
        let walletAddress;
        let amount;

        // Check if one of the addresses belongs to the wallet.
        addresses.some((address) => {
          walletAddress = findWalletAddress(address.address, network, externalAddresses, accountPublicKey);
          amount = address.out.value;

          return walletAddress;
        });

        if (!walletAddress) {
          throw new Error('Transaction is not redeemable');
        }

        return {
          ...message,
          address: walletAddress,
          txid: transaction.getId(),
          amountBtc: convertAmount(amount, UNIT_SATOSHIS, UNIT_BTC)
        };
      })
      .then((processedMessage) => {
        dispatch(processSuccess(processedMessage));
        return processedMessage;
      })
      .catch((error) => {
        dispatch(processFailure(error));
        throw error;
      });
  };
};
