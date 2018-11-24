import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import BackHeader from '../components/BackHeader';

const mapStateToProps = (state) => {
  return {
    nav: state.nav
  };
};

class BackHeaderContainer extends Component {
  static propTypes = {
    nav: PropTypes.object,
    dispatch: PropTypes.func,
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
      <BackHeader
        showBackButton={showBackButton}
        onBackPress={this._onBackPress.bind(this)}
        title={this.props.title}
      />
    );
  }
}

const BackHeaderConnector = connect(
  mapStateToProps
)(BackHeaderContainer);

export default BackHeaderConnector;
