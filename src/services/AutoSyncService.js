import { sync as syncWallet } from '../actions/bitcoin/wallet';

const SYNC_INTERVAL = 10 * 1000; // 10 seconds.

export default class AutoSyncService {
  constructor(store) {
    this.store = store;
  }

  start() {
    const { store } = this;

    // Sync wallet with an interval.
    this._syncInterval = setInterval(() => {
      const state = store.getState();
      const { initialized } = state.settings;
      const { disconnected } = state.network.internet;

      // Only sync if connected to the internet and has a wallet.
      if (!disconnected && initialized) {
        store.dispatch(syncWallet());
      }
    }, SYNC_INTERVAL);
  }

  stop() {
    clearInterval(this._syncInterval);
  }
}
