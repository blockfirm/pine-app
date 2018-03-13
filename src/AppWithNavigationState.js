import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import AppNavigator from './AppNavigator';

@connect((state) => ({
  nav: state.nav
}))
class AppWithNavigationState extends Component {
  constructor() {
    super(...arguments);
    this._addListener = createReduxBoundAddListener('root');
  }

  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          addListener: this._addListener
        })}
      />
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func,
  nav: PropTypes.object
};

export default AppWithNavigationState;
