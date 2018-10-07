import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import TransactionListContainer from '../containers/TransactionListContainer';
import TransactionsScreenHeader from '../components/TransactionsScreenHeader';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  }
});

@connect()
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

  render() {
    return (
      <BaseScreen style={styles.view}>
        <TransactionsScreenHeader onSettingsPress={this._showSettings.bind(this)} />
        <TransactionListContainer />
      </BaseScreen>
    );
  }
}

TransactionsScreen.propTypes = {
  dispatch: PropTypes.func
};
