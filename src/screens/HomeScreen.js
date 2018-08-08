import React, { Component } from 'react';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TransactionListContainer from '../containers/TransactionListContainer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  navigationIcon: {
    fontSize: 28,
    color: '#C0D2F3',
    padding: 10
  },
  view: {
    padding: 0
  }
});

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: '#26203D'
    },
    headerLeft: (
      <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
        <Icon name='ios-settings' style={styles.navigationIcon} />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <BaseScreen style={styles.view}>
        <StatusBar barStyle='light-content' />
        <TransactionListContainer />
      </BaseScreen>
    );
  }
}
