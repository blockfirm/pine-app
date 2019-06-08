import { post as postTransaction } from '../bitcoin/blockchain/transactions';
import { getIncoming as getIncomingMessages } from '../pine/messages/getIncoming';
import { remove as removeMessageFromServer } from '../pine/messages/remove';
import { save as saveContacts } from '../contacts';
import { add as addMessage } from './add';
import { process as processMessage } from './process';

export const MESSAGES_SYNC_REQUEST = 'MESSAGES_SYNC_REQUEST';
export const MESSAGES_SYNC_SUCCESS = 'MESSAGES_SYNC_SUCCESS';
export const MESSAGES_SYNC_FAILURE = 'MESSAGES_SYNC_FAILURE';

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

const processMessages = async (messages, dispatch) => {
  const processedMessages = [];

  for (const message of messages) {
    if (message.error) {
      processedMessages.push(message);
      continue;
    }

    try {
      const processedMessage = await dispatch(processMessage(message));
      processedMessages.push(processedMessage);
    } catch (error) {
      processedMessages.push({ ...message, error: error.message });
    }
  }

  return processedMessages;
};

const broadcastTransactions = (processedMessages, dispatch) => {
  const promises = processedMessages.map((message) => {
    if (message.amountBtc > 0) {
      return dispatch(postTransaction(message.data.transaction)).catch((error) => {
        if (error.message.includes('rejected')) {
          message.canceled = true;
        } else {
          message.error = error.message;
        }
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

const saveMessages = async (processedMessages, contacts, dispatch) => {
  const persistContact = false;

  for (const message of processedMessages) {
    const contact = getContactByAddress(message.from, contacts);

    if (contact) {
      await dispatch(addMessage(contact.id, message, persistContact));
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
    const contacts = state.contacts.items;
    let processedMessages;

    return dispatch(getIncomingMessages())
      .then((messages) => {
        return processMessages(messages, dispatch);
      })
      .then((messages) => {
        // Broadcast valid transactions.
        processedMessages = messages;
        return broadcastTransactions(processedMessages, dispatch);
      })
      .then(() => {
        // Save messages.
        return saveMessages(processedMessages, contacts, dispatch);
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
