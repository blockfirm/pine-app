import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { create as createTransaction } from '../../actions/bitcoin/wallet/transactions/create';
import { handle as handleError } from '../../actions/error/handle';
import ConfirmTransaction from '../../components/conversation/ConfirmTransaction';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile
  };
};

class ConfirmTransactionContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    address: PropTypes.string,
    amountBtc: PropTypes.number
  };

  state = {
    transaction: null,
    inputs: null,
    fee: null,
    cannotAffordFee: false
  }

  componentDidMount() {
    this._createTransaction();
  }

  _createTransaction() {
    const { dispatch, address, amountBtc } = this.props;

    dispatch(createTransaction(amountBtc, address))
      .then(({ transaction, inputs, fee }) => {
        if (fee === undefined) {
          return this.setState({ cannotAffordFee: true });
        }

        this.setState({ transaction, inputs, fee });
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  render() {
    const { transaction, inputs, fee, cannotAffordFee } = this.state;

    return (
      <ConfirmTransaction
        {...this.props}
        transaction={transaction}
        inputs={inputs}
        fee={fee}
        cannotAffordFee={cannotAffordFee}
      />
    );
  }
}

const ConfirmTransactionConnector = connect(
  mapStateToProps
)(ConfirmTransactionContainer);

export default ConfirmTransactionConnector;
