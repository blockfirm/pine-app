import React, { Component } from 'react';
import Title from '../components/Title';
import BaseScreen from './BaseScreen';

export default class HomeScreen extends Component {
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
