import { connect } from 'react-redux';
import TransactionListEmpty from '../components/TransactionListEmpty';

const mapStateToProps = (state) => {
  return {
    address: state.bitcoin.wallet.addresses.external.unused
  };
};

const TransactionListEmptyConnector = connect(
  mapStateToProps
)(TransactionListEmpty);

export default TransactionListEmptyConnector;
