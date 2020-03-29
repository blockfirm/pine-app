/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync } from '../../actions';
import { closeChannel } from '../../actions/lightning';
import { handle as handleError } from '../../actions/error';
import { withTheme } from '../../contexts/theme';
import { normalizeBtcAmount, satsToBtc } from '../../crypto/bitcoin';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import settingsStyles from '../../styles/settingsStyles';
import BackButton from '../../components/BackButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsButton from '../../components/SettingsButton';
import StyledText from '../../components/StyledText';
import StrongText from '../../components/StrongText';
import StackedBarChart from '../../components/charts/StackedBarChart';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  wrapper: {
    height: null,
    borderBottomWidth: 0,
    justifyContent: 'center',
    paddingRight: 0,
    marginRight: 15,
    marginVertical: 15
  },
  chartTitle: {
    fontSize: 15
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
  }
});

@connect((state) => ({
  balance: state.lightning.balance // Off-chain balances are in sats.
}))
class OffChainBalanceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Off-chain Balance' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  state = {
    closingChannel: false
  };

  async _closeChannel() {
    const { dispatch } = this.props;

    this.setState({ closingChannel: true });

    try {
      await dispatch(closeChannel());
      await dispatch(sync());
    } catch (error) {
      dispatch(handleError(error));
    }

    this.setState({ closingChannel: false });
  }

  _showCloseChannelConfirmation() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Do you want to close your Lightning channel? This will move all your on-chain funds to your off-chain funds, excluding fees. You can always reopen the channel later.',
      options: ['Cancel', 'Close Channel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        this._closeChannel();
      }
    });
  }

  _showOpenChannelScreen() {
    const { navigation } = this.props;
    navigation.navigate('OpenLightningChannel');
  }

  _renderCloseChannelButton() {
    return (
      <SettingsGroup>
        <SettingsButton
          title='Close Channel'
          type='destructive'
          onPress={this._showCloseChannelConfirmation.bind(this)}
          loading={this.state.closingChannel}
          style={styles.channelButton}
          containerStyle={styles.channelButtonContainer}
          loaderStyle={styles.channelButtonLoader}
          isLastItem={true}
        />
      </SettingsGroup>
    );
  }

  _renderOpenChannelButton() {
    return (
      <SettingsGroup>
        <SettingsButton
          title='Open Channel'
          onPress={this._showOpenChannelScreen.bind(this)}
          style={styles.channelButton}
          containerStyle={styles.channelButtonContainer}
          loaderStyle={styles.channelButtonLoader}
          isLastItem={true}
        />
      </SettingsGroup>
    );
  }

  _renderButtons() {
    const { pending, local, remote } = this.props.balance;

    if (pending) {
      return null;
    }

    if (local || remote) {
      return this._renderCloseChannelButton();
    }

    return this._renderOpenChannelButton();
  }

  render() {
    const { theme, balance } = this.props;
    const { local, remote, commitFee, unredeemed, spendable } = balance;
    const localBtc = satsToBtc(local);
    const remoteBtc = satsToBtc(remote);
    const spendableBtc = satsToBtc(spendable);
    const commitFeeBtc = satsToBtc(commitFee);
    const unredeemedBtc = satsToBtc(unredeemed);
    const pending = balance.pending ? local : 0;
    const reserved = commitFee + (balance.pending ? 0 : (local - spendable));

    const balanceData = [
      { label: 'Spendable', color: theme.walletBalanceOffChainColor, value: spendable },
      { label: 'Pending', color: theme.walletBalancePendingColor, value: pending },
      { label: 'Unredeemed', color: theme.walletBalanceUnredeemedColor, value: unredeemed },
      { label: 'Reserved', color: theme.walletBalanceReservedColor, value: reserved }
    ];

    const capacityData = [
      { label: 'Outbound', color: theme.walletBalanceOffChainColor, value: local },
      { label: 'Inbound', color: theme.walletBalancePendingColor, value: remote }
    ];

    return (
      <BaseSettingsScreen>
        { this._renderButtons() }

        <SettingsTitle>Balance</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <StyledText style={styles.chartTitle}>
              <CurrencyLabelContainer
                amountBtc={spendableBtc}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;of&nbsp;
              <CurrencyLabelContainer
                amountBtc={normalizeBtcAmount(localBtc + commitFeeBtc + unredeemedBtc)}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;Spendable
            </StyledText>
            <StackedBarChart data={balanceData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          <StrongText>Spendable</StrongText> balance can be spent over the Lightning network.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Pending</StrongText> balance is waiting to be confirmed in a funding
          or closing transaction and should soon be spendable either on-chain or off-chain.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Unredeemed</StrongText> balance is incoming payments waiting to be redeemed.
          Make sure you have sufficient inbound capacity.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Reserved</StrongText> balance is reserved for potential fees. This can change over time.
        </SettingsDescription>

        <SettingsTitle>Lightning Capacity</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <View>
              <StyledText style={styles.chartTitle}>
                Outbound:&nbsp;
                <CurrencyLabelContainer
                  amountBtc={localBtc}
                  currencyType='primary'
                  style={styles.spendableText}
                />
              </StyledText>
            </View>
            <View>
              <StyledText style={styles.chartTitle}>
                Inbound:&nbsp;
                <CurrencyLabelContainer
                  amountBtc={remoteBtc}
                  currencyType='primary'
                  style={styles.spendableText}
                />
              </StyledText>
            </View>
            <StackedBarChart data={capacityData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          <StrongText>Outbound</StrongText> capacity is how much you can spend over the Lightning network.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Inbound</StrongText> capacity is how much you can receive over the Lightning network.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

OffChainBalanceScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  balance: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withTheme(OffChainBalanceScreen);
