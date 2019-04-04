import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import authentication from '../../authentication';
import Button from '../Button';
import Footer from '../Footer';
import StyledText from '../StyledText';
import Bullet from '../typography/Bullet';
import FeeLabel from '../FeeLabel';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

const BIOMETRY_TYPE_TOUCH_ID = 'TouchID';
const BIOMETRY_TYPE_FACE_ID = 'FaceID';

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'stretch',
    backgroundColor: '#FAFAFA',
    borderTopColor: '#F0F1F4',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  footer: {
    backgroundColor: 'transparent'
  },
  details: {
    alignSelf: 'stretch',
    marginTop: 16,
    marginHorizontal: 16
  },
  detail: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECECEC'
  },
  lastDetail: {
    borderBottomWidth: 0
  },
  label: {
    color: '#8E8E93',
    fontSize: 15
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  value: {
    color: '#000000',
    fontSize: 15,
    position: 'absolute',
    right: 0,
    top: 16
  },
  valueLabel: {
    color: '#000000',
    fontSize: 15
  },
  errorText: {
    color: '#FF3B30'
  },
  bold: {
    fontWeight: '600',
    color: 'black'
  }
});

export default class ConfirmTransaction extends Component {
  state = {
    biometryType: null
  }

  componentDidMount() {
    // Get the supported biometry authentication type.
    authentication.getSupportedBiometryType().then((biometryType) => {
      this.setState({ biometryType });
    });
  }

  _getButtonLabel() {
    switch (this.state.biometryType) {
      case BIOMETRY_TYPE_TOUCH_ID:
        return 'Pay with Touch ID';

      case BIOMETRY_TYPE_FACE_ID:
        return 'Pay with Face ID';

      default:
        return 'Pay';
    }
  }

  _renderFee() {
    const { amountBtc, displayUnit, fee, cannotAffordFee } = this.props;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;

    if (cannotAffordFee) {
      return (
        <StyledText style={styles.errorText}>
          Not enough funds to pay for the transaction fee.
        </StyledText>
      );
    }

    if (!feeBtc) {
      return <ActivityIndicator size='small' />;
    }

    return (
      <FeeLabel fee={feeBtc} amount={amountBtc} unit={displayUnit} style={styles.valueLabel} />
    );
  }

  _renderTotal() {
    const { amountBtc, fee } = this.props;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;
    const totalAmount = amountBtc + feeBtc;

    return (
      <View style={styles.valueWrapper}>
        <CurrencyLabelContainer amountBtc={totalAmount} currencyType='primary' style={[styles.valueLabel, styles.bold]} />
        <Bullet />
        <CurrencyLabelContainer amountBtc={totalAmount} currencyType='secondary' style={styles.valueLabel} />
      </View>
    );
  }

  render() {
    const { fee } = this.props;

    return (
      <View style={[styles.view, this.props.style]}>
        <View style={styles.details}>
          <View style={styles.detail}>
            <StyledText style={styles.label}>Fee</StyledText>
            <View style={styles.value}>
              {this._renderFee()}
            </View>
          </View>
          <View style={[styles.detail, styles.lastDetail]}>
            <StyledText style={[styles.label, styles.bold]}>You Pay</StyledText>
            <View style={styles.value}>
              {this._renderTotal()}
            </View>
          </View>
        </View>
        <Footer style={styles.footer}>
          <Button
            label={this._getButtonLabel()}
            onPress={this.props.onPayPress}
            showLoader={true}
            hapticFeedback={true}
            disabled={fee === null}
          />
        </Footer>
      </View>
    );
  }
}

ConfirmTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  amountBtc: PropTypes.number.isRequired,
  displayUnit: PropTypes.string.isRequired,
  transaction: PropTypes.object,
  inputs: PropTypes.array,
  fee: PropTypes.number,
  cannotAffordFee: PropTypes.bool,
  onPayPress: PropTypes.func,
  style: PropTypes.any
};
