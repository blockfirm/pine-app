/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';

import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import authentication from '../../authentication';
import HelpIcon from '../icons/HelpIcon';
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
  feeLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
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
    color: '#FF3B30',
    marginTop: 1
  },
  bold: {
    fontWeight: '600',
    color: 'black'
  },
  helpIcon: {
    paddingHorizontal: 5,
    opacity: 0.75
  },
  helpText: {
    color: '#8E8E93',
    marginTop: 5,
    fontSize: 13
  }
});

export default class ConfirmTransaction extends Component {
  state = {
    biometryType: null,
    showFeeHelpText: false
  }

  constructor() {
    super(...arguments);
    this._toggleFeeHelpText = this._toggleFeeHelpText.bind(this);
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

  _toggleFeeHelpText() {
    const animation = LayoutAnimation.create(
      200,
      LayoutAnimation.Types['easeOut'],
      LayoutAnimation.Properties.opacity
    );

    LayoutAnimation.configureNext(animation);

    this.setState({
      showFeeHelpText: !this.state.showFeeHelpText
    });
  }

  _renderFeeHelpText() {
    if (!this.state.showFeeHelpText) {
      return null;
    }

    return (
      <StyledText style={styles.helpText}>
        The fee goes to the miner who mines the block containing your transaction.
        Pine or its developers does not charge any fees.
      </StyledText>
    );
  }

  _renderFee() {
    const { amountBtc, displayUnit, fee, cannotAffordFee } = this.props;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;

    if (cannotAffordFee) {
      return (
        <StyledText style={styles.errorText}>
          Not enough funds to pay for the fee
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
    return (
      <View style={[styles.view, this.props.style]}>
        <View style={styles.details}>
          <View style={styles.detail}>
            <View style={styles.feeLabelWrapper}>
              <StyledText style={styles.label}>Fee</StyledText>
              <TouchableOpacity onPress={this._toggleFeeHelpText}>
                { this.state.showFeeHelpText ? null : <HelpIcon style={styles.helpIcon} /> }
              </TouchableOpacity>
            </View>
            <View style={styles.value}>
              {this._renderFee()}
            </View>
            { this._renderFeeHelpText() }
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
            disabled={this.props.fee === null}
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
