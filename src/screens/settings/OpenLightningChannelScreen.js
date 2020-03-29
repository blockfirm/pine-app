import React, { Component } from 'react';
import { StyleSheet, View, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';

import { sync } from '../../actions';
import { openChannel } from '../../actions/lightning';
import { handle as handleError } from '../../actions/error';
import { withTheme } from '../../contexts/theme';
import { satsToBtc, btcToSats } from '../../crypto/bitcoin';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import CancelButton from '../../components/CancelButton';
import HeaderButton from '../../components/buttons/HeaderButton';
import StyledText from '../../components/StyledText';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsGroup from '../../components/SettingsGroup';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import BaseSettingsScreen from './BaseSettingsScreen';

const MIN_SATS_AMOUNT = 10000;

const styles = StyleSheet.create({
  amountWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15
  },
  sliderWrapper: {
    marginLeft: 15,
    marginRight: 15
  },
  slider: {
    width: '100%',
    height: 40
  },
  channelButtonContainer: {
    paddingRight: 0,
    marginLeft: 0
  },
  channelButton: {
    alignSelf: 'center'
  },
  channelButtonLoader: {
    right: null,
    alignSelf: 'center'
  },
  notEnoughFundsText: {
    margin: 15
  }
});

@connect((state) => ({
  spendableBitcoinBalance: state.bitcoin.wallet.spendableBalance
}))
class OpenLightningChannelScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const canSubmit = navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title='Open Channel' />,
      headerLeft: <CancelButton onPress={screenProps.dismiss} />,
      headerRight: <HeaderButton label='Open' onPress={submit} disabled={!canSubmit} />
    };
  };

  state = {
    openingChannel: false,
    satsAmount: MIN_SATS_AMOUNT
  };

  componentDidMount() {
    const { navigation, spendableBitcoinBalance } = this.props;
    const spendableSats = btcToSats(spendableBitcoinBalance);
    const canSubmit = spendableSats >= MIN_SATS_AMOUNT;

    navigation.setParams({
      canSubmit,
      submit: this._showOpenChannelConfirmation.bind(this)
    });
  }

  async _openChannel() {
    const { dispatch, screenProps } = this.props;
    const { satsAmount } = this.state;

    this.setState({ openingChannel: true });

    try {
      await dispatch(openChannel(satsAmount));
      await dispatch(sync());
      screenProps.dismiss();
    } catch (error) {
      this.setState({ openingChannel: false });
      dispatch(handleError(error));
    }
  }

  _showOpenChannelConfirmation() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Do you want to open a new Lightning channel? This will move the selected amount of on-chain funds to your off-chain funds. You can always move them back later (excluding fees).',
      options: ['Cancel', 'Open Channel'],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        this._openChannel();
      }
    });
  }

  _onAmountChange(satsAmount) {
    this.setState({ satsAmount });
  }

  _renderNotEnoughFunds() {
    const { theme } = this.props;
    const minimumBtcAmount = satsToBtc(MIN_SATS_AMOUNT);

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <StyledText style={[theme.errorText, styles.notEnoughFundsText]}>
            You need a minimum of&nbsp;
            <CurrencyLabelContainer
              amountBtc={minimumBtcAmount}
              currencyType='primary'
              style={theme.errorText}
            />
            &nbsp;in spendable on-chain funds before you can open a channel.
          </StyledText>
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }

  render() {
    const { theme, spendableBitcoinBalance } = this.props;
    const { satsAmount } = this.state;
    const spendableSats = btcToSats(spendableBitcoinBalance);
    const btcAmount = satsToBtc(satsAmount);

    if (spendableSats < MIN_SATS_AMOUNT) {
      return this._renderNotEnoughFunds();
    }

    return (
      <BaseSettingsScreen>
        <SettingsTitle>Select Amount</SettingsTitle>
        <SettingsGroup>
          <View style={styles.amountWrapper}>
            <CurrencyLabelContainer
              amountBtc={btcAmount}
              currencyType='primary'
            />
          </View>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              step={1000}
              minimumValue={MIN_SATS_AMOUNT}
              maximumValue={spendableSats}
              value={satsAmount}
              onValueChange={this._onAmountChange.bind(this)}
              minimumTrackTintColor={theme.sliderTrackTintColor}
              maximumTrackTintColor={theme.sliderTrackTintBackgroundColor}
            />
          </View>
        </SettingsGroup>
        <SettingsDescription>
          Select the amount you would like to move from your on-chain funds to an off-chain channel.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

OpenLightningChannelScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object,
  spendableBitcoinBalance: PropTypes.number,
  theme: PropTypes.object.isRequired
};

export default withTheme(OpenLightningChannelScreen);
