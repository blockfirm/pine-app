import { openConversation } from './navigate/openConversation';

export const READY = 'READY';

/**
 * Action to trigger when the app has finished starting and is ready.
 * Only when the app has been setup with a wallet and user account.
 */
export const ready = () => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: READY });

    if (state.navigate.deferredOpenConversation) {
      const contactOrAddress = state.navigate.deferredOpenConversation;
      dispatch(openConversation(contactOrAddress));
    }
  };
};
