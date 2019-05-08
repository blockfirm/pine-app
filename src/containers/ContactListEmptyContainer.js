import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import ContactListEmpty from '../components/ContactListEmpty';

const mapStateToProps = (state) => {
  return {
    address: state.bitcoin.wallet.addresses.external.unused
  };
};

class ContactListEmptyContainer extends Component {
  static propTypes = {
    navigation: PropTypes.any
  };

  constructor() {
    super(...arguments);
    this._onAddContactPress = this._onAddContactPress.bind(this);
  }

  _onAddContactPress() {
    const { navigation } = this.props;
    navigation.navigate('AddContact');
  }

  render() {
    return (
      <ContactListEmpty
        {...this.props}
        onAddContactPress={this._onAddContactPress}
      />
    );
  }
}

const ContactListEmptyConnector = connect(
  mapStateToProps
)(ContactListEmptyContainer);

export default withNavigation(ContactListEmptyConnector);
