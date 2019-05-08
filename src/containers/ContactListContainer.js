import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncApp } from '../actions/sync';
import ContactList from '../components/ContactList';

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts.items || {}
  };
};

class ContactListContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  _onRefresh() {
    const dispatch = this.props.dispatch;
    return dispatch(syncApp());
  }

  scrollToTop() {
    this._contactList.scrollToTop();
  }

  render() {
    return (
      <ContactList
        {...this.props}
        ref={ref => { this._contactList = ref; }}
        onRefresh={this._onRefresh.bind(this)}
      />
    );
  }
}

const ContactListConnector = connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(ContactListContainer);

export default ContactListConnector;
