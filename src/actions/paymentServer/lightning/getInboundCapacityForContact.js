import getInboundCapacity from '../../../clients/paymentServer/user/lightning/capacity/get';

export const PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_REQUEST = 'PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_REQUEST';
export const PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_SUCCESS = 'PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_SUCCESS';
export const PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_FAILURE = 'PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_FAILURE';

const getInboundCapacityForContactRequest = () => {
  return {
    type: PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_REQUEST
  };
};

const getInboundCapacityForContactSuccess = (inbound) => {
  return {
    type: PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_SUCCESS,
    inbound
  };
};

const getInboundCapacityForContactFailure = (error) => {
  return {
    type: PINE_LIGHTNING_GET_INBOUND_CAPACITY_FOR_CONTACT_FAILURE,
    error
  };
};

/**
 * Action to get inbound lightning capacity for a Pine contact.
 *
 * @param {string} userId - Contact's user ID.
 */
export const getInboundCapacityForContact = (userId) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getInboundCapacityForContactRequest());

    return getInboundCapacity(userId, credentials)
      .then((inbound) => {
        dispatch(getInboundCapacityForContactSuccess(inbound));
        return inbound;
      })
      .catch((error) => {
        dispatch(getInboundCapacityForContactFailure(error));
        throw error;
      });
  };
};
