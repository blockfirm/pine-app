import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
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
    const { navigation, contact } = this.props;
    navigation.navigate('Conversation', { contact });
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

export default withNavigation(TransactionListItemConnector);
