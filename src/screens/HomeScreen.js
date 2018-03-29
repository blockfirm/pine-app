import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Title from '../components/Title';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  navigationIcon: {
    fontSize: 28,
    color: '#017AFF',
    padding: 10
  }
});

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
        <Icon name='ios-settings-outline' style={styles.navigationIcon} />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <BaseScreen>
        <Title>
          Welcome to Wallet ID!
        </Title>
      </BaseScreen>
    );
  }
}
