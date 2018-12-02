import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import OfflineNoticeContainer from '../containers/OfflineNoticeContainer';
import TransactionListContainer from '../containers/TransactionListContainer';
import TransactionsScreenHeader from '../components/TransactionsScreenHeader';
import BaseScreen from './BaseScreen';

const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  bottomGradient: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    width: WINDOW_WIDTH,
    height: 150 + ifIphoneX(24, 0)
  }
});

@connect(null, null, null, { withRef: true })
export default class TransactionsScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showSettings() {
    const dispatch = this.props.dispatch;

    dispatch(
      NavigationActions.navigate({ routeName: 'Settings' })
    );
  }

  scrollToTop() {
    if (this._transactionList) {
      this._transactionList.scrollToTop();
    }
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <TransactionsScreenHeader onSettingsPress={this._showSettings.bind(this)} />
        <OfflineNoticeContainer />
        <TransactionListContainer ref={ref => { this._transactionList = ref && ref.getWrappedInstance(); }} />

        <View style={styles.bottomGradient} pointerEvents='none'>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 1.0)']}
            locations={[0.1, 0.7]}
            style={styles.bottomGradient}
          />
        </View>
      </BaseScreen>
    );
  }
}

TransactionsScreen.propTypes = {
  dispatch: PropTypes.func
};
