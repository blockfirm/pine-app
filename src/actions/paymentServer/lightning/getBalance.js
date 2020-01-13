import { openChannel } from './openChannel';

export const PINE_LIGHTNING_GET_BALANCE_REQUEST = 'PINE_LIGHTNING_GET_BALANCE_REQUEST';
export const PINE_LIGHTNING_GET_BALANCE_SUCCESS = 'PINE_LIGHTNING_GET_BALANCE_SUCCESS';
export const PINE_LIGHTNING_GET_BALANCE_FAILURE = 'PINE_LIGHTNING_GET_BALANCE_FAILURE';

const getBalanceRequest = () => {
  return {
    type: PINE_LIGHTNING_GET_BALANCE_REQUEST
  };
};

const getBalanceSuccess = (balance) => {
  return {
    type: PINE_LIGHTNING_GET_BALANCE_SUCCESS,
    balance
  };
};

const getBalanceFailure = (error) => {
  return {
    type: PINE_LIGHTNING_GET_BALANCE_FAILURE,
    error
  };
};

export const getBalance = (client) => {
  return (dispatch) => {
    console.log('LIGHTNING getBalance');
    dispatch(getBalanceRequest());

    return client.getBalance()
      .catch((error) => {
        if (error.message.includes('No open channels')) {
          // DEBUG: Open channel with 20,000 satoshis if no channel is already open.
          const satsAmount = 20000;
          return dispatch(openChannel(satsAmount, client)).then(() => client.getBalance());
        }

        throw error;
      })
      .then((balance) => {
        dispatch(getBalanceSuccess(balance));
        console.log('LIGHTNING BALANCE', balance);
        return balance;
      })
      .catch((error) => {
        dispatch(getBalanceFailure(error));
        throw error;
      });
  };
};
