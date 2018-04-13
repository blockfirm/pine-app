import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Header from '../components/Header';

const mapStateToProps = (state) => {
  return {
    nav: state.nav
  };
};

class HeaderContainer extends Component {
  static propTypes = {
    nav: PropTypes.object,
    dispatch: PropTypes.func,
    backButtonIconStyle: PropTypes.any,
    title: PropTypes.string
  };

  _onBackPress() {
    const dispatch = this.props.dispatch;
    dispatch(NavigationActions.back());
  }

  _shouldShowBackButton() {
    // Show back button if there is navigation history.
    const nav = this.props.nav.routes[0];
    const showBackButton = nav.index > 0;

    return showBackButton;
  }

  render() {
    const showBackButton = this._shouldShowBackButton();

    return (
      <Header
        showBackButton={showBackButton}
        onBackPress={this._onBackPress.bind(this)}
        backButtonIconStyle={this.props.backButtonIconStyle}
        title={this.props.title}
      />
    );
  }
}

const HeaderConnector = connect(
  mapStateToProps
)(HeaderContainer);

export default HeaderConnector;
