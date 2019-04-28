/* eslint-disable max-lines */
import bitcoin from 'bitcoinjs-lib';
import generateAddress from '../../crypto/bitcoin/generateAddress';
import { convert as convertAmount, UNIT_BTC, UNIT_SATOSHIS } from '../../crypto/bitcoin/convert';
import { add as addExternalAddress } from '../bitcoin/wallet/addresses/external';
import { post as postTransaction } from '../bitcoin/blockchain/transactions';
import { getIncoming as getIncomingMessages } from '../pine/messages/getIncoming';
import { remove as removeMessageFromServer } from '../pine/messages/remove';
import { markAsUnread as markContactAsUnread, save as saveContacts } from '../contacts';
import { add as addMessage } from './add';

export const MESSAGES_SYNC_REQUEST = 'MESSAGES_SYNC_REQUEST';
export const MESSAGES_SYNC_SUCCESS = 'MESSAGES_SYNC_SUCCESS';
export const MESSAGES_SYNC_FAILURE = 'MESSAGES_SYNC_FAILURE';

const MESSAGE_TYPE_PAYMENT = 'payment';

const syncRequest = () => {
  return {
    type: MESSAGES_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: MESSAGES_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: MESSAGES_SYNC_FAILURE,
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

  const isInternalAddress = false;

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

const processMessage = (message, network, externalAddresses, accountPublicKey) => {
  validateMessage(message, network);

  const rawTransaction = message.data.transaction;
  const transaction = bitcoin.Transaction.fromHex(rawTransaction);
  const bitcoinNetwork = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.mainnet;

  // Get addresses from transaction.
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
};

const processMessages = (messages, network, externalAddresses, accountPublicKey) => {
  return messages.map((message) => {
    if (message.error) {
      return message;
    }

    try {
      return processMessage(message, network, externalAddresses, accountPublicKey);
    } catch (error) {
      return { ...message, error: error.message };
    }
  });
};

const saveAddresses = (processedMessages, dispatch) => {
  const addressMap = processedMessages.reduce((map, message) => {
    const { address } = message;

    if (address) {
      map[address.address] = {
        index: address.index,
        used: true
      };
    }

    return map;
  }, {});

  if (Object.keys(addressMap).length === 0) {
    return Promise.resolve();
  }

  return dispatch(addExternalAddress(addressMap));
};

const broadcastTransactions = (processedMessages, dispatch) => {
  const promises = processedMessages.map((message) => {
    if (message.amount > 0) {
      return dispatch(postTransaction(message.data.transaction)).catch((error) => {
        message.error = error.message;
      });
    }
  });

  return Promise.all(promises);
};

const getContactByAddress = (address, contacts) => {
  return Object.values(contacts).find((contact) => {
    return contact.address === address;
  });
};

const saveMessages = async (processedMessages, contacts, activeContact, dispatch) => {
  for (const message of processedMessages) {
    const contact = getContactByAddress(message.from, contacts);

    if (contact) {
      await dispatch(addMessage(contact.id, message));

      if (!activeContact || contact.id !== activeContact.id) {
        await dispatch(markContactAsUnread(contact, false));
      }
    }
  }

  await dispatch(saveContacts());
};

const removeMessagesFromServer = (processedMessages, dispatch) => {
  const promises = processedMessages.map((message) => {
    return dispatch(removeMessageFromServer(message));
  });

  return Promise.all(promises);
};

/**
 * Action to sync incoming messages from server and broadcast valid transactions.
 *
 * @returns {Promise} A promise that resolves when the sync is complete.
 */
export const sync = () => {
  return (dispatch, getState) => {
    dispatch(syncRequest());

    const state = getState();
    const { activeConversation } = state.navigate;
    const activeContact = activeConversation && activeConversation.contact;
    const { network } = state.settings.bitcoin;
    const key = Object.values(state.keys.items)[0];
    const { accountPublicKey } = key;
    const externalAddresses = state.bitcoin.wallet.addresses.external.items;
    const contacts = state.contacts.items;
    let processedMessages;

    return dispatch(getIncomingMessages())
      .then((messages) => {
        return processMessages(messages, network, externalAddresses, accountPublicKey);
      })
      .then((messages) => {
        // Save/update addresses used in transactions.
        processedMessages = messages;
        return saveAddresses(processedMessages, dispatch);
      })
      .then(() => {
        // Broadcast valid transactions.
        return broadcastTransactions(processedMessages, dispatch);
      })
      .then(() => {
        // Save messages.
        return saveMessages(processedMessages, contacts, activeContact, dispatch);
      })
      .then(() => {
        // Remove messages from server.
        return removeMessagesFromServer(processedMessages, dispatch);
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
        throw error;
      });
  };
};
