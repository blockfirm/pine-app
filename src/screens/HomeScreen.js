import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Title from '../components/Title';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  navigationIcon: {
    fontSize: 28,
    color: '#322A51',
    padding: 10
  }
});

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
        <Icon name='ios-settings' style={styles.navigationIcon} />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <BaseScreen>
        <Title>
          Welcome to Payla!
        </Title>
      </BaseScreen>
    );
  }
}
