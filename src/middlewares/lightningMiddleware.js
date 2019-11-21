/* eslint-disable lines-around-comment */
import * as actions from '../actions';
import { handle as handleError } from '../actions/error';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { LightningClient } from '../pineApi/lightning';

const getMnemonic = (keys) => {
  const defaultKey = keys[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * This is a redux middleware that manages the Pine Lightning
 * client and integrates it with redux.
 */
const lightningMiddleware = () => {
  let client;

  return store => next => action => {
    const state = store.getState();
    const { settings } = state;

    if (!settings || !settings.user) {
      return next(action);
    }

    const pineAddress = settings.user.profile.address;
    const keys = Object.values(state.keys.items || {});

    switch (action.type) {
      // Connect when app is ready.
      case actions.READY:
        if (!client) {
          getMnemonic(keys).then(mnemonic => {
            client = new LightningClient(pineAddress, mnemonic, settings.lightning);
            client.on('error', (error) => store.dispatch(handleError(error)));
            client.connect();
          });
        }

        break;

      // Disconnect when app is reset (user signed out).
      case actions.RESET_SUCCESS:
        if (client) {
          client.disconnect();
          client.removeAllListeners();
          client = null;
        }

        break;

      default:
        return next(action);
    }
  };
};

export default lightningMiddleware();
