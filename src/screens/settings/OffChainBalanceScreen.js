/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEstimate } from '../../actions/bitcoin/fees';
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

const AVERAGE_TX_BYTES = 300;

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
  }
});

const getReservedCapacity = (capacity, percentCapacityReservedForFees) => {
  const reserved = capacity * percentCapacityReservedForFees / 100;
  return Math.floor(reserved);
};

@connect((state) => ({
  balance: state.lightning.balance, // Off-chain balances are in sats.
  percentCapacityReservedForFees: state.settings.lightning.percentCapacityReservedForFees,
  fundingFeePriority: state.settings.lightning.fundingFee.numberOfBlocks
}))
class OffChainBalanceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Off-chain Balance' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  state = {
    satsPerByte: 0
  };

  async componentDidMount() {
    const { dispatch, fundingFeePriority } = this.props;
    const satsPerByte = await dispatch(getEstimate(fundingFeePriority));

    this.setState({ satsPerByte });
  }

  _showCloseChannelConfirmation() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Do you want to close your Lightning channel? This will move all your off-chain funds to your on-chain funds, excluding fees. You can always reopen the channel later.',
      options: ['Cancel', 'Close Channel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        this._closeChannel();
      }
    });
  }

  _closeChannel() {
    const { navigation } = this.props;
    navigation.navigate('ClosingChannel');
  }

  _showOpenChannelScreen() {
    const { navigation } = this.props;
    navigation.navigate('OpenLightningChannel');
  }

  _renderCloseChannelButton() {
    const { commitFee } = this.props.balance;

    return (
      <>
        <SettingsGroup>
          <SettingsButton
            title='Close Channel'
            type='destructive'
            onPress={this._showCloseChannelConfirmation.bind(this)}
            style={styles.channelButton}
            containerStyle={styles.channelButtonContainer}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Estimated closing fee:&nbsp;
          <CurrencyLabelContainer
            amountBtc={satsToBtc(commitFee)}
            currencyType='secondary'
          />
        </SettingsDescription>
      </>
    );
  }

  _renderOpenChannelButton() {
    const { fundingFeePriority } = this.props;
    const { satsPerByte } = this.state;
    const hoursToConfirm = fundingFeePriority / 6;

    return (
      <>
        <SettingsGroup>
          <SettingsButton
            title='Open Channel'
            onPress={this._showOpenChannelScreen.bind(this)}
            style={styles.channelButton}
            containerStyle={styles.channelButtonContainer}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Estimated opening fee (~{hoursToConfirm} hrs):&nbsp;
          {satsPerByte ? <CurrencyLabelContainer
            amountBtc={satsToBtc(satsPerByte * AVERAGE_TX_BYTES)}
            currencyType='secondary'
          /> : 'Estimating...'}
        </SettingsDescription>
      </>
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
    const { theme, balance, percentCapacityReservedForFees } = this.props;
    const { capacity, local, remote, commitFee, unredeemed, spendable, pending } = balance;
    const localBtc = satsToBtc(local);
    const spendableBtc = satsToBtc(spendable);
    const commitFeeBtc = satsToBtc(commitFee);
    const unredeemedBtc = satsToBtc(unredeemed);
    const reserved = commitFee + (pending ? 0 : (local - spendable));
    const reservedCapacity = getReservedCapacity(capacity, percentCapacityReservedForFees);
    const sendCapacity = Math.max(0, local - reservedCapacity);
    const receiveCapacity = Math.max(0, remote - reservedCapacity);

    const balanceData = [
      { label: 'Spendable', color: theme.walletBalanceOffChainColor, value: spendable },
      { label: 'Pending', color: theme.walletBalancePendingColor, value: pending },
      { label: 'Unredeemed', color: theme.walletBalanceUnredeemedColor, value: unredeemed },
      { label: 'Reserved', color: theme.walletBalanceReservedColor, value: reserved }
    ];

    const capacityData = [
      { label: 'Send', color: theme.walletBalanceOffChainColor, value: sendCapacity },
      { label: 'Receive', color: theme.walletBalanceInboundColor, value: receiveCapacity }
    ];

    return (
      <BaseSettingsScreen>
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
          transaction and should soon be spendable.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Unredeemed</StrongText> balance is incoming payments waiting to be redeemed.
          Make sure you have sufficient inbound capacity.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Reserved</StrongText> balance is reserved for potential fees. This can change over time.
        </SettingsDescription>

        <SettingsTitle>Capacity</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <View>
              <StyledText style={styles.chartTitle}>
                Can Send:&nbsp;
                <CurrencyLabelContainer
                  amountBtc={satsToBtc(sendCapacity)}
                  currencyType='primary'
                  style={styles.spendableText}
                />
              </StyledText>
            </View>
            <View>
              <StyledText style={styles.chartTitle}>
                Can Receive:&nbsp;
                <CurrencyLabelContainer
                  amountBtc={satsToBtc(receiveCapacity)}
                  currencyType='primary'
                  style={styles.spendableText}
                />
              </StyledText>
            </View>
            <StackedBarChart data={capacityData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          2% of the total channel capacity has been deducted from
          both amounts as it is reserved for potential fees.
        </SettingsDescription>

        { this._renderButtons() }
      </BaseSettingsScreen>
    );
  }
}

OffChainBalanceScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  balance: PropTypes.object,
  percentCapacityReservedForFees: PropTypes.number,
  fundingFeePriority: PropTypes.number,
  theme: PropTypes.object.isRequired
};

export default withTheme(OffChainBalanceScreen);
