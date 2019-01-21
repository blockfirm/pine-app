import { connect } from 'react-redux';
import TransactionTitle from '../../components/transaction/TransactionTitle';

const mapStateToProps = (state) => {
  return {
    externalAddresses: state.bitcoin.wallet.addresses.external.items,
    internalAddresses: state.bitcoin.wallet.addresses.internal.items
  };
};

const TransactionTitleConnector = connect(
  mapStateToProps
)(TransactionTitle);

export default TransactionTitleConnector;
