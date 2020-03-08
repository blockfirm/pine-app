import { save as saveSettings } from '../settings';
import { getClient } from '../../clients/lightning';

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

export const getBalance = () => {
  return (dispatch) => {
    console.log('LIGHTNING getBalance');
    const client = getClient();
    dispatch(getBalanceRequest());

    return client.getBalance()
      .catch((error) => {
        if (error.message.includes('No open channels')) {
          return {
            local: 0,
            remote: 0,
            commitFee: 0,
            pending: false
          };
        }

        throw error;
      })
      .then((balance) => {
        // Cache balance in settings.
        dispatch(saveSettings({
          lightning: { balance }
        }));

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
