import * as bitcoin from 'bitcoinjs-lib';
import normalizeBtcAmount from '../../crypto/bitcoin/normalizeBtcAmount';
import { post as postTransaction } from '../bitcoin/blockchain/transactions';
import { sign as signTransaction } from '../bitcoin/wallet/transactions';
import { sync as syncWallet } from '../bitcoin/wallet';
import { remove as removeMessageFromServer } from '../pine/messages/remove';
import { setLastMessage } from '../contacts';
import { add as addToMessageTxIds } from './txids';
import { save } from './save';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

export const MESSAGES_CANCEL_PAYMENT_REQUEST = 'MESSAGES_CANCEL_PAYMENT_REQUEST';
export const MESSAGES_CANCEL_PAYMENT_SUCCESS = 'MESSAGES_CANCEL_PAYMENT_SUCCESS';
export const MESSAGES_CANCEL_PAYMENT_FAILURE = 'MESSAGES_CANCEL_PAYMENT_FAILURE';

const cancelPaymentRequest = () => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_REQUEST
  };
};

const cancelPaymentSuccess = (messageId, contactId) => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_SUCCESS,
    messageId,
    contactId
  };
};

const cancelPaymentFailure = (error) => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_FAILURE,
    error
  };
};

/**
 * Creates a new transaction that uses the same inputs but pays to oneself
 * in order to invalidate the specified transaction.
 *
 * @param {Transaction} transaction - A bitcoinjs Transaction object to cancel.
 * @param {string} changeAddress - Internal address the new transaction should pay to.
 * @param {Object[]} utxos - All UTXOs - for finding addresses for each input.
 *
 * @returns {Object} ({ inputs, outputs }) Inputs and outputs of the cancel transaction.
 */
const createCancellationTransaction = (transaction, changeAddress, utxos) => {
  const outputValue = transaction.outs.reduce((sum, output) => {
    return normalizeBtcAmount(sum + output.value);
  }, 0);

  const inputs = transaction.ins.map((input) => {
    const txid = Buffer.from(input.hash).reverse().toString('hex');
    const utxo = utxos.find((output) => output.n === input.index && output.txid === txid);

    if (!utxo) {
      throw new Error('UTXO could not be found');
    }

    const satoshis = convertBitcoin(utxo.value, UNIT_BTC, UNIT_SATOSHIS);

    return {
      txid,
      vout: input.index,
      value: satoshis,
      addresses: utxo.scriptPubKey.addresses
    };
  });

  const outputs = [{
    address: changeAddress,
    value: outputValue
  }];

  return { inputs, outputs };
};

/**
 * Action to cancel a payment that has not yet been broadcasted.
 *
 * @param {Object} message - Payment message to cancel.
 * @param {string} message.id - ID of the message.
 * @param {Object} message.data - Message data.
 * @param {string} message.data.transaction - Raw serialized bitcoin transaction.
 * @param {Object} contact - Contact the message was sent to.
 * @param {string} contact.id - ID of the contact.
 * @param {string} contact.address - Pine address of the contact.
 * @param {string} contact.userId - User ID of the contact.
 *
 * @returns {Promise} A promise that resolves when the payment has been canceled.
 */
export const cancelPayment = (message, contact) => {
  return (dispatch, getState) => {
    dispatch(cancelPaymentRequest());

    return Promise.resolve().then(() => {
      const state = getState();
      const changeAddress = state.bitcoin.wallet.addresses.internal.unused;
      const transaction = bitcoin.Transaction.fromHex(message.data.transaction);

      const { inputs, outputs } = createCancellationTransaction(
        transaction,
        changeAddress,
        state.bitcoin.wallet.utxos.items
      );

      return dispatch(signTransaction(inputs, outputs))
        .then((psbt) => {
          const cancelTransaction = psbt.extractTransaction();
          const rawTransaction = cancelTransaction.toHex();
          const txid = cancelTransaction.getId();

          return dispatch(postTransaction(rawTransaction)).then(() => txid);
        })
        .then((txid) => {
          // Add txid to the list of message transaction IDs.
          return dispatch(addToMessageTxIds(txid));
        })
        .then(() => {
          return dispatch(removeMessageFromServer(message, contact)).catch(() => {
            // Suppress errors since the cancel transaction has already been broadcasted anyhow.
          });
        })
        .then(() => {
          if (contact.lastMessage.id !== message.id) {
            return;
          }

          // Update last message on contact.
          return dispatch(setLastMessage(contact, {
            ...message,
            canceled: true
          }));
        })
        .then(() => {
          return dispatch(syncWallet());
        })
        .then(() => {
          /**
           * The message is flagged as canceled by the reducer.
           * So save the state after the action, not before.
           */
          dispatch(cancelPaymentSuccess(message.id, contact.id));
          return dispatch(save(contact.id));
        })
        .catch((error) => {
          dispatch(cancelPaymentFailure(error));
          throw error;
        });
    });
  };
};
