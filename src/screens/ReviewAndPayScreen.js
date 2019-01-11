/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';
import bitcoin from 'bitcoinjs-lib';
import bip32 from 'bip32';
import bip39 from 'bip39';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../crypto/bitcoin/convert';

import authentication from '../authentication';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { setHomeScreenIndex } from '../actions/setHomeScreenIndex';
import * as keyActions from '../actions/keys';
import { handle as handleError } from '../actions/error/handle';
import { create as createTransaction } from '../actions/bitcoin/wallet/transactions/create';
import { post as postTransaction } from '../actions/bitcoin/blockchain/transactions/post';
import { sync as syncWallet } from '../actions/bitcoin/wallet';
import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Bullet from '../components/typography/Bullet';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ContentView from '../components/ContentView';
import StyledText from '../components/StyledText';
import AutoFontSize from '../components/AutoFontSize';
import BtcLabel from '../components/BtcLabel';
import UnitLabel from '../components/UnitLabel';
import AddressLabel from '../components/AddressLabel';
import FeeLabel from '../components/FeeLabel';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const BIOMETRY_TYPE_TOUCH_ID = 'TouchID';
const BIOMETRY_TYPE_FACE_ID = 'FaceID';

const HOME_SCREEN_INDEX_TRANSACTIONS = 1;

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  scroll: {
    alignSelf: 'stretch'
  },
  amountContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#EFF0F8',
    borderRadius: 8,
    margin: 16
  },
  payTitle: {
    color: '#AAAAAA',
    fontSize: 17,
    letterSpacing: 0.07
  },
  amount: {
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: -0.1,
    color: '#000000'
  },
  amountUnit: {
    color: '#AAAAAA',
    fontSize: 17
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

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.mainnet;
};

@connect((state) => ({
  keys: state.keys.items,
  addresses: state.bitcoin.wallet.addresses,
  network: state.settings.bitcoin.network,
  defaultBitcoinUnit: state.settings.bitcoin.unit
}))
export default class ReviewAndPayScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Review and Pay',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
    };
  };

  state = {
    biometryType: null,
    transaction: null,
    inputs: null,
    fee: null,
    cannotAffordFee: false,
    isSigned: false
  }

  componentDidMount() {
    // Get the supported biometry authentication type.
    authentication.getSupportedBiometryType().then((biometryType) => {
      this.setState({ biometryType });
    });

    this._createTransaction();
  }

  _createTransaction() {
    const dispatch = this.props.dispatch;
    const { address, amountBtc } = this.props.navigation.state.params;

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

  _getAddressIndex(address) {
    const externalAddresses = this.props.addresses.external.items;
    const internalAddresses = this.props.addresses.internal.items;

    if (address in externalAddresses) {
      return {
        addressIndex: externalAddresses[address].index,
        internal: false
      };
    }

    if (address in internalAddresses) {
      return {
        addressIndex: internalAddresses[address].index,
        internal: true
      };
    }

    return {};
  }

  _getKeyPairForAddress(address, mnemonic) {
    const { addressIndex, internal } = this._getAddressIndex(address);

    if (addressIndex === undefined) {
      return;
    }

    const seed = bip39.mnemonicToSeed(mnemonic);
    const masterNode = bip32.fromSeed(seed, getBitcoinNetwork(this.props.network));

    const purpose = 49; // BIP49
    const coinType = this.props.network === 'testnet' ? 1 : 0; // Default to mainnet.
    const accountIndex = 0;
    const change = Number(internal); // 0 = external, 1 = internal change address
    const path = `m/${purpose}'/${coinType}'/${accountIndex}'/${change}/${addressIndex}`;
    const node = masterNode.derivePath(path);

    return node;
  }

  _getRedeemScript(keyPair) {
    const p2wpkh = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: getBitcoinNetwork(this.props.network)
    });

    return p2wpkh.output;
  }

  _signInputs(mnemonic) {
    const { transaction, inputs } = this.state;

    inputs.forEach((input, index) => {
      const addressKeys = input.addresses.map((address) => {
        return this._getKeyPairForAddress(address, mnemonic);
      });

      const keyPair = addressKeys.find(key => key);
      const redeemScript = this._getRedeemScript(keyPair);

      transaction.sign(index, keyPair, redeemScript, null, input.value);
    });

    this.setState({ isSigned: true });
  }

  _getMnemonic() {
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id);
  }

  _signAndPay() {
    const dispatch = this.props.dispatch;
    const { transaction, isSigned } = this.state;

    return this._getMnemonic()
      .then((mnemonic) => {
        // Sign all the inputs.
        if (!isSigned) {
          this._signInputs(mnemonic);
        }
      })
      .then(() => {
        // Build the transaction.
        return transaction.build().toHex();
      })
      .then((rawTransaction) => {
        // Broadcast the transaction.
        return dispatch(postTransaction(rawTransaction));
      })
      .then(() => {
        // Sync wallet before finishing.
        dispatch(setHomeScreenIndex(HOME_SCREEN_INDEX_TRANSACTIONS));
        return dispatch(syncWallet());
      })
      .then(() => {
        // The payment was successfully sent.
        ReactNativeHaptic.generate('notificationSuccess');
        this.props.screenProps.dismiss();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _authenticateAndPay() {
    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        return this._signAndPay();
      }
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

  _getBtcDisplayUnit() {
    const navigationParams = this.props.navigation.state.params;
    const displayUnit = navigationParams.displayUnit || this.props.defaultBitcoinUnit;

    return displayUnit;
  }

  _renderFee() {
    const displayUnit = this._getBtcDisplayUnit();
    const { amountBtc } = this.props.navigation.state.params;
    const { fee, cannotAffordFee } = this.state;
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
    const { amountBtc } = this.props.navigation.state.params;
    const { fee } = this.state;
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
    const displayUnit = this._getBtcDisplayUnit();
    const { address, amountBtc } = this.props.navigation.state.params;
    const { transaction } = this.state;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <ScrollView style={styles.scroll}>
            <View style={styles.amountContainer}>
              <StyledText style={styles.payTitle}>PAY</StyledText>
              <View>
                <AutoFontSize margin={150}>
                  <BtcLabel amount={amountBtc} unit={displayUnit} hideUnit={true} style={styles.amount} />
                </AutoFontSize>
              </View>
              <UnitLabel unit={displayUnit} style={styles.amountUnit} />
            </View>
            <View style={styles.details}>
              <View style={styles.detail}>
                <StyledText style={styles.label}>To</StyledText>
                <AddressLabel address={address} style={styles.value} />
              </View>
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
          </ScrollView>
        </ContentView>
        <Footer>
          <Button
            label={this._getButtonLabel()}
            disabled={!Boolean(transaction)}
            onPress={this._authenticateAndPay.bind(this)}
            showLoader={true}
            hapticFeedback={true}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

ReviewAndPayScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  screenProps: PropTypes.object,
  keys: PropTypes.object,
  addresses: PropTypes.object,
  network: PropTypes.string,
  defaultBitcoinUnit: PropTypes.string
};
