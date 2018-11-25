import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import bitcoin from 'bitcoinjs-lib';
import coinSelect from 'coinselect';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../crypto/bitcoin/convert';

import { handle as handleError } from '../actions/error/handle';
import { getEstimate as getFeeEstimate } from '../actions/bitcoin/fees';
import headerStyles from '../styles/headerStyles';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ContentView from '../components/ContentView';
import StyledText from '../components/StyledText';
import BtcLabel from '../components/BtcLabel';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
});

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.mainnet;
};

@connect((state) => ({
  utxos: state.bitcoin.wallet.utxos.items,
  changeAddress: state.bitcoin.wallet.addresses.internal.unused,
  network: state.settings.bitcoin.network
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
    transaction: null,
    fee: null
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;

    // Get transaction fee estimate.
    dispatch(getFeeEstimate())
      .then((satoshisPerByte) => {
        // Create a transaction.
        this._createTransaction(satoshisPerByte);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _getUtxos() {
    return this.props.utxos.map((utxo) => {
      const satoshis = convertBitcoin(utxo.value, UNIT_BTC, UNIT_SATOSHIS);

      return {
        txId: utxo.txid,
        vout: utxo.n,
        value: satoshis
      };
    });
  }

  _selectUtxos(satoshisPerByte) {
    const feeRate = Math.round(satoshisPerByte) || 1; // coinSelect doesn't support decimal fee rates.
    const { address, amountBtc } = this.props.navigation.state.params;
    const satoshis = convertBitcoin(amountBtc, UNIT_BTC, UNIT_SATOSHIS);
    const utxos = this._getUtxos();

    const targets = [{
      address,
      value: satoshis
    }];

    const { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);

    // No solution was found.
    if (!inputs || !outputs) {
      return;
    };

    return { inputs, outputs, fee };
  }

  _createTransaction(satoshisPerByte) {
    const { changeAddress } = this.props;
    const { inputs, outputs, fee } = this._selectUtxos(satoshisPerByte);
    const bitcoinNetwork = getBitcoinNetwork(this.props.network);
    const transactionBuilder = new bitcoin.TransactionBuilder(bitcoinNetwork);

    inputs.forEach((input) => {
      transactionBuilder.addInput(input.txId, input.vout);
    });

    outputs.forEach((output) => {
      output.address = output.address || changeAddress;
      transactionBuilder.addOutput(output.address, output.value);
    });

    this.setState({
      transaction: transactionBuilder,
      fee
    });
  }

  render() {
    const { address, amountBtc, displayUnit } = this.props.navigation.state.params;
    const { transaction, fee } = this.state;
    const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;
    const totalAmount = amountBtc + feeBtc;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <View>
            <StyledText>To: {address}</StyledText>
          </View>
          <View>
            <StyledText>
              Amount: <BtcLabel amount={amountBtc} unit={displayUnit} />
            </StyledText>
          </View>
          <View>
            <StyledText>Fee: </StyledText>
            {
              feeBtc ? <BtcLabel amount={feeBtc} unit={displayUnit} /> : <ActivityIndicator size='small' />
            }
          </View>
          <View>
            <StyledText>
              Total: <BtcLabel amount={totalAmount} unit={displayUnit} />
            </StyledText>
          </View>
        </ContentView>
        <Footer>
          <Button label='Pay' disabled={!Boolean(transaction)} onPress={() => {}} />
        </Footer>
      </BaseScreen>
    );
  }
}

ReviewAndPayScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  utxos: PropTypes.array,
  changeAddress: PropTypes.string,
  network: PropTypes.string
};
