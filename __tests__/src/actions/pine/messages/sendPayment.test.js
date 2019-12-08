import sendMessage from '../../../../../src/clients/paymentServer/user/messages/send';

import {
  sendPayment,
  PINE_MESSAGES_SEND_PAYMENT_REQUEST,
  PINE_MESSAGES_SEND_PAYMENT_SUCCESS,
  PINE_MESSAGES_SEND_PAYMENT_FAILURE
} from '../../../../../src/actions/pine/messages/sendPayment';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    bitcoin: {
      network: 'testnet'
    }
  },
  pine: {
    credentials: {
      userId: 'ab14eb2b-14b6-4524-b37b-5b598a9b4e37'
    }
  }
}));

jest.mock('../../../../../src/clients/paymentServer/user/messages/send', () => {
  return jest.fn(() => Promise.resolve({
    id: '876ff441-4c78-4a8d-8fb9-ac1eaddb81a7'
  }));
});

describe('PINE_MESSAGES_SEND_PAYMENT_REQUEST', () => {
  it('equals "PINE_MESSAGES_SEND_PAYMENT_REQUEST"', () => {
    expect(PINE_MESSAGES_SEND_PAYMENT_REQUEST).toBe('PINE_MESSAGES_SEND_PAYMENT_REQUEST');
  });
});

describe('PINE_MESSAGES_SEND_PAYMENT_SUCCESS', () => {
  it('equals "PINE_MESSAGES_SEND_PAYMENT_SUCCESS"', () => {
    expect(PINE_MESSAGES_SEND_PAYMENT_SUCCESS).toBe('PINE_MESSAGES_SEND_PAYMENT_SUCCESS');
  });
});

describe('PINE_MESSAGES_SEND_PAYMENT_FAILURE', () => {
  it('equals "PINE_MESSAGES_SEND_PAYMENT_FAILURE"', () => {
    expect(PINE_MESSAGES_SEND_PAYMENT_FAILURE).toBe('PINE_MESSAGES_SEND_PAYMENT_FAILURE');
  });
});

describe('sendPayment', () => {
  let transaction;
  let contact;

  beforeEach(() => {
    transaction = '02c0a668-7e0e-46cc-9010-bac1a7036f23';

    contact = {
      address: 'to@pine.pm',
      userId: '8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD',
      publicKey: '6QXA9rJB1HT8NaezaAD7UKSVUirwLvGrwhUgpszaRPvbRdMohE'
    };

    sendMessage.mockClear();
  });

  it('is a function', () => {
    expect(typeof sendPayment).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = sendPayment(transaction, contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = sendPayment(transaction, contact);
    });

    it('dispatches an action of type PINE_MESSAGES_SEND_PAYMENT_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_MESSAGES_SEND_PAYMENT_REQUEST
      });
    });

    it('sends the payment as a message to the passed contact and credentials from state', () => {
      const expectedMessage = {
        version: 1,
        type: 'payment',
        data: {
          transaction,
          network: 'bitcoin_testnet'
        }
      };

      const expectedCredentials = {
        userId: 'ab14eb2b-14b6-4524-b37b-5b598a9b4e37'
      };

      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(sendMessage).toHaveBeenCalled();
        expect(sendMessage).toHaveBeenCalledWith(expectedMessage, contact, expectedCredentials);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_MESSAGES_SEND_PAYMENT_SUCCESS with the returned message', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_MESSAGES_SEND_PAYMENT_SUCCESS,
            message: expect.objectContaining({
              id: '876ff441-4c78-4a8d-8fb9-ac1eaddb81a7'
            })
          });
        });
      });

      it('resolves to the returned message', () => {
        expect.hasAssertions();

        return promise.then((message) => {
          expect(message).toEqual(expect.objectContaining({
            id: '876ff441-4c78-4a8d-8fb9-ac1eaddb81a7'
          }));
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from sendMessage().
        sendMessage.mockImplementationOnce(() => Promise.reject(
          new Error('6880d04a-e991-43b9-94e2-420dc9ed4137')
        ));

        promise = sendPayment(transaction, contact)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_MESSAGES_SEND_PAYMENT_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_MESSAGES_SEND_PAYMENT_FAILURE,
            error: expect.objectContaining({
              message: '6880d04a-e991-43b9-94e2-420dc9ed4137'
            })
          });
        });
      });
    });
  });
});
