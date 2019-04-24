import { verify, decrypt } from '../../../pineApi/crypto';
import getMessages from '../../../pineApi/user/messages/get';

export const PINE_MESSAGES_GET_REQUEST = 'PINE_MESSAGES_GET_REQUEST';
export const PINE_MESSAGES_GET_SUCCESS = 'PINE_MESSAGES_GET_SUCCESS';
export const PINE_MESSAGES_GET_FAILURE = 'PINE_MESSAGES_GET_FAILURE';

const getIncomingRequest = () => {
  return {
    type: PINE_MESSAGES_GET_REQUEST
  };
};

const getIncomingSuccess = (contacts) => {
  return {
    type: PINE_MESSAGES_GET_SUCCESS,
    contacts
  };
};

const getFailure = (error) => {
  return {
    type: PINE_MESSAGES_GET_FAILURE,
    error
  };
};

const verifySignature = (encryptedMessage, signature, userId) => {
  try {
    return verify(encryptedMessage, signature, userId);
  } catch (error) {
    return false;
  }
};

const getContactByAddress = (contacts, address) => {
  return contacts.find((contact) => contact.address === address);
};

const decryptMessage = async (message, contacts, privateKey) => {
  const { from, encryptedMessage, signature } = message;
  const contact = getContactByAddress(contacts, from);

  const verified = verifySignature(encryptedMessage, signature, contact.userId);
  const decryptedJson = await decrypt(encryptedMessage, privateKey);
  const decryptedMessage = JSON.parse(decryptedJson);

  return {
    ...decryptedMessage,
    id: message.id,
    createdAt: message.createdAt,
    from,
    verified
  };
};

const decryptMessages = (messages, contacts, privateKey) => {
  const promises = messages.map((message) => {
    return decryptMessage(message, contacts, privateKey).catch((error) => {
      return {
        ...message,
        error: error.message
      };
    });
  });

  return Promise.all(promises);
};

/**
 * Action to get all incoming messages from the user's Pine server.
 */
export const getIncoming = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;
    const { privateKey } = credentials.keyPair;
    const contacts = Object.values(state.contacts.items);

    dispatch(getIncomingRequest());

    return getMessages(credentials)
      .then((messages) => {
        return decryptMessages(messages, contacts, privateKey);
      })
      .then((messages) => {
        dispatch(getIncomingSuccess(messages));
        return messages;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
