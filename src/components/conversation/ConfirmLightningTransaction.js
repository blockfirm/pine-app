import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import * as bolt11 from 'bolt11';

import { withTheme } from '../../contexts/theme';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import authentication from '../../authentication';
import Button from '../Button';
import Footer from '../Footer';
import StyledText from '../StyledText';
import Bullet from '../typography/Bullet';

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
  bold: {
    fontWeight: '600'
  }
});

class ConfirmLightningTransaction extends Component {
  state = {
    biometryType: null,
    decodedPaymentRequest: null,
    amountBtc: 0
  }

  static getDerivedStateFromProps(props) {
    if (props.paymentRequest) {
      return null;
    }

    return {
      amountBtc: props.amountBtc
    };
  }

  componentDidMount() {
    const { paymentRequest } = this.props;

    // Get the supported biometry authentication type.
    authentication.getSupportedBiometryType().then((biometryType) => {
      this.setState({ biometryType });
    });

    if (paymentRequest) {
      const decodedPaymentRequest = bolt11.decode(paymentRequest);
      const amountBtc = convertBitcoin(decodedPaymentRequest.satoshis, UNIT_SATOSHIS, UNIT_BTC);

      this.setState({
        decodedPaymentRequest,
        amountBtc
      });
    }
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

  _renderTotal() {
    const { displayCurrency, displayUnit, theme } = this.props;
    const totalAmount = this.state.amountBtc;
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

    return (
      <View style={[styles.view, theme.confirmTransactionView, this.props.style]}>
        <View style={styles.details}>
          <View style={[styles.detail, styles.lastDetail]}>
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
          />
        </Footer>
      </View>
    );
  }
}

ConfirmLightningTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  amountBtc: PropTypes.number.isRequired,
  displayCurrency: PropTypes.string.isRequired,
  displayUnit: PropTypes.string,
  paymentRequest: PropTypes.string,
  onPayPress: PropTypes.func,
  style: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(ConfirmLightningTransaction);
