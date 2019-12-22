/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Dimensions
} from 'react-native';

import { withTheme } from '../../contexts/theme';
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

const WINDOW_HEIGHT = Dimensions.get('window').height;

const BIOMETRY_TYPE_TOUCH_ID = 'TouchID';
const BIOMETRY_TYPE_FACE_ID = 'FaceID';

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    alignSelf: 'stretch',
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
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  lastDetail: {
    borderBottomWidth: 0
  },
  label: {
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
    fontSize: 15,
    position: 'absolute',
    right: 0,
    top: 16
  },
  valueLabel: {
    fontSize: 15
  },
  errorText: {
    marginTop: 1
  },
  bold: {
    fontWeight: '600'
  },
  helpIcon: {
    paddingHorizontal: 5,
    opacity: 0.75
  },
  helpIconActive: {
    opacity: 1
  },
  helpText: {
    marginTop: 5,
    fontSize: 13
  }
});

class ConfirmTransaction extends Component {
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
    const { theme } = this.props;

    if (!this.state.showFeeHelpText) {
      return null;
    }

    return (
      <StyledText style={[styles.helpText, theme.confirmTransactionHelpText]}>
        The fee goes to the miner who mines the block containing your transaction.
        Pine or its developers does not charge any fees.
      </StyledText>
    );
  }

  _renderFee() {
    const { amountBtc, displayCurrency, displayUnit, fee, cannotAffordFee, theme } = this.props;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;

    if (cannotAffordFee) {
      return (
        <StyledText style={[styles.errorText, theme.confirmTransactionErrorText]}>
          Not enough funds to pay for the fee
        </StyledText>
      );
    }

    if (!feeBtc) {
      return <ActivityIndicator color='gray' size='small' />;
    }

    return (
      <FeeLabel
        fee={feeBtc}
        amount={amountBtc}
        currency={displayCurrency}
        unit={displayUnit}
        style={[styles.valueLabel, theme.confirmTransactionValue]}
      />
    );
  }

  _renderTotal() {
    const { amountBtc, fee, displayCurrency, displayUnit, theme } = this.props;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;
    const totalAmount = amountBtc + feeBtc;
    let amountLabel = null;

    if (displayCurrency === UNIT_BTC) {
      amountLabel = (
        <CurrencyLabelContainer
          amountBtc={totalAmount}
          currency={displayCurrency}
          unit={displayUnit}
          style={[styles.valueLabel, theme.confirmTransactionValue, styles.bold]}
        />
      );
    } else {
      amountLabel = (
        <CurrencyLabelContainer
          amountBtc={totalAmount}
          currencyType='primary'
          style={[styles.valueLabel, theme.confirmTransactionValue, styles.bold]}
        />
      );
    }

    return (
      <View style={styles.valueWrapper}>
        {amountLabel}
        <Bullet />
        <CurrencyLabelContainer
          amountBtc={totalAmount}
          currencyType='secondary'
          style={[styles.valueLabel, theme.confirmTransactionValue, styles.bold]}
        />
      </View>
    );
  }

  render() {
    const { theme } = this.props;
    const { showFeeHelpText } = this.state;
    const hideTotal = showFeeHelpText && WINDOW_HEIGHT < 700;

    return (
      <View style={[styles.view, theme.confirmTransactionView, this.props.style]}>
        <View style={styles.details}>
          <View style={[styles.detail, theme.confirmTransactionDetail]}>
            <TouchableOpacity onPress={this._toggleFeeHelpText}>
              <View style={styles.feeLabelWrapper}>
                <StyledText style={[styles.label, theme.confirmTransactionLabel]}>
                  Fee
                </StyledText>
                <HelpIcon style={[styles.helpIcon, showFeeHelpText && styles.helpIconActive]} />
              </View>
            </TouchableOpacity>
            <View style={[styles.value, theme.confirmTransactionValue]}>
              {this._renderFee()}
            </View>
            { this._renderFeeHelpText() }
          </View>
          <View style={[styles.detail, styles.lastDetail, hideTotal && { opacity: 0 }]}>
            <StyledText style={[styles.label, theme.confirmTransactionLabel, styles.bold]}>
              You Pay
            </StyledText>
            <View style={[styles.value, theme.confirmTransactionValue]}>
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
  displayCurrency: PropTypes.string.isRequired,
  displayUnit: PropTypes.string,
  fee: PropTypes.number,
  cannotAffordFee: PropTypes.bool,
  onPayPress: PropTypes.func,
  style: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(ConfirmTransaction);
