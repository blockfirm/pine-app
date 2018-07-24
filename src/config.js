export default {
  initialized: false, // If false, show welcome screen
  api: {
    baseUrl: 'http://localhost:8080/v1'
  },
  bitcoin: {
    network: 'testnet', // 'mainnet' or 'testnet'
    unit: 'BTC' // 'BTC' or 'mBTC'
  }
};
