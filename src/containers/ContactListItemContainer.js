import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openConversation } from '../actions/navigate';
import ContactListItem from '../components/ContactListItem';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile
  };
};

class ContactListItemContainer extends Component {
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
      <ContactListItem
        {...this.props}
        onPress={this._onPress}
      />
    );
  }
}

const ContactListItemConnector = connect(
  mapStateToProps
)(ContactListItemContainer);

export default ContactListItemConnector;
