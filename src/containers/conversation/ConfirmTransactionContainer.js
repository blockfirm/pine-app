import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';

import {
  create as createTransaction,
  sign as signTransaction
} from '../../actions/bitcoin/wallet/transactions';

import { handle as handleError } from '../../actions/error/handle';
import authentication from '../../authentication';
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
    amountBtc: PropTypes.number,
    onTransactionSent: PropTypes.func
  };

  state = {
    transaction: null,
    inputs: null,
    fee: null,
    cannotAffordFee: false
  }

  constructor() {
    super(...arguments);
    this._onPayPress = this._onPayPress.bind(this);
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

  _signAndPay() {
    const { dispatch } = this.props;
    const { transaction, inputs } = this.state;

    return dispatch(signTransaction(transaction, inputs))
      .then(() => {
        return transaction.build().toHex();
      })
      .then(() => {
        ReactNativeHaptic.generate('notificationSuccess');
        this.props.onTransactionSent();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _onPayPress() {
    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        return this._signAndPay();
      }
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
        onPayPress={this._onPayPress}
      />
    );
  }
}

const ConfirmTransactionConnector = connect(
  mapStateToProps
)(ConfirmTransactionContainer);

export default ConfirmTransactionConnector;
