import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openConversation } from '../actions/navigate';
import TransactionListItem from '../components/TransactionListItem';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile
  };
};

class TransactionListItemContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.any,
    contact: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    const { dispatch, contact } = this.props;
    dispatch(openConversation(contact));
  }

  render() {
    return (
      <TransactionListItem
        {...this.props}
        onPress={this._onPress}
      />
    );
  }
}

const TransactionListItemConnector = connect(
  mapStateToProps
)(TransactionListItemContainer);

export default TransactionListItemConnector;
