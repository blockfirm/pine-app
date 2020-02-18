import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openConversation } from '../actions/navigate';
import ContactListItem from '../components/ContactListItem';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile,
    invoicesByMessageId: state.lightning.invoices.itemsByMessageId
  };
};

class ContactListItemContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.any,
    contact: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired,
    invoicesByMessageId: PropTypes.object.isRequired
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    const { dispatch, contact } = this.props;
    dispatch(openConversation(contact));
  }

  _findInvoice() {
    const { contact, invoicesByMessageId } = this.props;
    const { lastMessage } = contact;

    if (lastMessage && lastMessage.type === 'lightning_payment') {
      return invoicesByMessageId[lastMessage.id];
    }
  }

  render() {
    const lastMessageInvoice = this._findInvoice();

    return (
      <ContactListItem
        {...this.props}
        lastMessageInvoice={lastMessageInvoice}
        onPress={this._onPress}
      />
    );
  }
}

const ContactListItemConnector = connect(
  mapStateToProps
)(ContactListItemContainer);

export default ContactListItemConnector;
