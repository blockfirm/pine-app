import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { accept as acceptContactRequest } from '../actions/contacts/contactRequests';
import ContactRequest from '../components/ContactRequest';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile
  };
};

class ContactRequestContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    contact: PropTypes.object,
    onAccept: PropTypes.func
  };

  constructor() {
    super(...arguments);

    this._onAccept = this._onAccept.bind(this);
    this._onIgnore = this._onIgnore.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  _onAccept() {
    const { dispatch, contact, onAccept } = this.props;
    return dispatch(acceptContactRequest(contact)).then(onAccept);
  }

  _onIgnore() {

  }

  _onDelete() {

  }

  render() {
    return (
      <ContactRequest
        {...this.props}
        onAccept={this._onAccept}
        onIgnore={this._onIgnore}
        onDelete={this._onDelete}
      />
    );
  }
}

const ContactRequestConnector = connect(
  mapStateToProps
)(ContactRequestContainer);

export default ContactRequestConnector;
