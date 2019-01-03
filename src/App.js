import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import ErrorModalContainer from './containers/ErrorModalContainer';
import ServiceManager from './services/ServiceManager';
import getAppWithNavigationState from './getAppWithNavigationState';

export default class App extends Component {
  constructor(props) {
    super(...arguments);

    this._services = new ServiceManager(props.store);
    this.AppWithNavigationState = getAppWithNavigationState();
  }

  componentDidMount() {
    this._services.start();
  }

  componentWillUnmount() {
    this._services.stop();
  }

  render() {
    const { AppWithNavigationState } = this;

    return (
      <View style={{ flex: 1, alignSelf: 'stretch' }}>
        <AppWithNavigationState />
        <ErrorModalContainer />
      </View>
    );
  }
}

App.propTypes = {
  store: PropTypes.any.isRequired
};
