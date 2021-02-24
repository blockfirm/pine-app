import React, { Component } from 'react';
import { StyleSheet, View, ActionSheetIOS, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEstimate } from '../../actions/bitcoin/fees';
import { withTheme } from '../../contexts/theme';
import headerStyles from '../../styles/headerStyles';
import { satsToBtc, btcToSats } from '../../crypto/bitcoin';
import ContentView from '../../components/ContentView';
import Paragraph from '../../components/Paragraph';
import LightningSlider from '../../components/lightning/LightningSlider';
import NotEnoughFunds from '../../components/lightning/NotEnoughFunds';
import HeaderBackground from '../../components/HeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import CancelButton from '../../components/CancelButton';
import HeaderButton from '../../components/buttons/HeaderButton';
import StyledText from '../../components/StyledText';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import BaseScreen from '../BaseScreen';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = WINDOW_WIDTH - 80;

const MIN_SATS_AMOUNT = 50000;
const MAX_SATS_AMOUNT = 1000000;

const AVERAGE_TX_BYTES = 300;

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  contentView: {
    paddingLeft: 20,
    paddingRight: 20
  },
  topWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 80
  },
  text: {
    maxWidth: 300,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 30
  },
  amountWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 5
  },
  amountPrimary: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  amountSecondary: {
    fontSize: 18
  },
  sliderWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  bottomWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metric: {
    flex: 2,
    alignItems: 'center'
  },
  metricTitle: {
    width: 110,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 5
  },
  feePrimary: {
    fontSize: 18,
    fontWeight: '600'
  },
  feeSecondary: {
  },
  hours: {
    fontSize: 20,
    fontWeight: '600'
  }
});

@connect((state) => ({
  spendableBitcoinBalance: state.bitcoin.wallet.spendableBalance,
  fundingFeePriority: state.settings.lightning.fundingFee.numberOfBlocks
}))
class OpenLightningChannelScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const canSubmit = navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');

    return {
      headerTransparent: true,
      headerBackground: <HeaderBackground />,
      headerStyle: headerStyles.borderlessHeader,
      headerTitle: <HeaderTitle title='Open Channel' />,
      headerLeft: <CancelButton onPress={screenProps.dismiss} />,
      headerRight: <HeaderButton label='Open' onPress={submit} disabled={!canSubmit} />
    };
  };

  state = {
    satsAmount: MIN_SATS_AMOUNT,
    satsPerByte: 0
  };

  async componentDidMount() {
    const {
      dispatch,
      navigation,
      spendableBitcoinBalance,
      fundingFeePriority
    } = this.props;

    const satsPerByte = await dispatch(getEstimate(fundingFeePriority));

    this.setState({ satsPerByte }, () => {
      const spendableSats = btcToSats(spendableBitcoinBalance);
      const canSubmit = spendableSats >= this._getMinimumFunds();

      navigation.setParams({
        canSubmit,
        submit: this._showOpenChannelConfirmation.bind(this)
      });
    });
  }

  _openChannel() {
    const { navigation } = this.props;
    const { satsAmount } = this.state;

    navigation.navigate('OpeningChannel', { satsAmount });
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
    requestAnimationFrame(() => {
      this.setState({ satsAmount });
    });
  }

  _getMinimumFunds() {
    const { satsPerByte } = this.state;
    const satsFee = satsPerByte * AVERAGE_TX_BYTES;

    return MIN_SATS_AMOUNT + satsFee * 2;
  }

  _renderNotEnoughFunds() {
    const minimumSatsAmount = Math.ceil(this._getMinimumFunds() * 1.1); // 10% margin in case fees goes up.
    const minimumBtcAmount = satsToBtc(minimumSatsAmount);

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.contentView}>
          <NotEnoughFunds minimumBtcAmount={minimumBtcAmount} />
        </ContentView>
      </BaseScreen>
    );
  }

  render() {
    const { theme, spendableBitcoinBalance, fundingFeePriority } = this.props;
    const { satsAmount, satsPerByte } = this.state;
    const satsFee = satsPerByte * AVERAGE_TX_BYTES;
    const satsReserved = Math.ceil(satsFee * 1.5);
    const spendableSats = btcToSats(spendableBitcoinBalance);
    const btcAmount = satsToBtc(satsAmount);
    const btcFee = satsToBtc(satsFee);
    const hoursToConfirm = fundingFeePriority / 6;
    const upperLimit = Math.min(spendableSats - satsReserved, MAX_SATS_AMOUNT);

    if (spendableSats < this._getMinimumFunds()) {
      return this._renderNotEnoughFunds();
    }

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.contentView}>
          <View style={styles.topWrapper}>
            <Paragraph style={styles.text}>
              Select the amount you would like to move from your on-chain funds to a Lightning channel.
            </Paragraph>
          </View>

          <View style={styles.sliderWrapper}>
            <LightningSlider
              width={SLIDER_SIZE}
              height={SLIDER_SIZE}
              value={satsAmount}
              maximumValue={spendableSats}
              lowerLimit={MIN_SATS_AMOUNT}
              upperLimit={upperLimit}
              onValueChange={this._onAmountChange.bind(this)}
              step={10000}
            />
            <View style={styles.amountWrapper}>
              <CurrencyLabelContainer
                style={[theme.text, styles.amountPrimary]}
                amountBtc={btcAmount}
                currencyType='primary'
              />
              <CurrencyLabelContainer
                style={[theme.text, styles.amountSecondary]}
                amountBtc={btcAmount}
                currencyType='secondary'
              />
            </View>
          </View>

          <View style={styles.bottomWrapper}>
            <View style={styles.metrics}>
              <View style={styles.metric}>
                <StyledText style={[theme.metricTitle, styles.metricTitle]}>
                  Estimated Opening Fee
                </StyledText>
                <CurrencyLabelContainer
                  style={[theme.text, styles.feePrimary]}
                  amountBtc={btcFee}
                  currencyType='primary'
                />
                <CurrencyLabelContainer
                  style={[theme.text, styles.feeSecondary]}
                  amountBtc={btcFee}
                  currencyType='secondary'
                />
              </View>
              <View style={styles.metric}>
                <StyledText style={[theme.metricTitle, styles.metricTitle]}>
                  Estimated Opening Time
                </StyledText>
                <StyledText style={[theme.text, styles.feePrimary]}>
                  {hoursToConfirm} hours
                </StyledText>
                <StyledText style={[theme.text, styles.feeSecondary]}>
                  {fundingFeePriority} blocks
                </StyledText>
              </View>
            </View>
          </View>
        </ContentView>
      </BaseScreen>
    );
  }
}

OpenLightningChannelScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object,
  spendableBitcoinBalance: PropTypes.number,
  fundingFeePriority: PropTypes.number,
  theme: PropTypes.object.isRequired
};

export default withTheme(OpenLightningChannelScreen);
