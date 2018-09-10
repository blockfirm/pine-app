/* eslint-disable lines-around-comment */
export default {
  initialized: false, // If false, show welcome screen
  user: {
    // The user must accept the Terms and Conditions before using the app.
    hasAcceptedTerms: false
  },
  api: {
    baseUrl: 'http://localhost:8080/v1'
  },
  bitcoin: {
    network: 'testnet', // 'mainnet' or 'testnet'
    unit: 'BTC' // 'BTC' or 'mBTC'
  }
};
