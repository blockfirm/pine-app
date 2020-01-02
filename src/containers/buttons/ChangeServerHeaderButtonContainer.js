import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderButton from '../../components/buttons/HeaderButton';

const styles = StyleSheet.create({
  button: {
    fontWeight: '400'
  }
});

const mapStateToProps = (state) => ({
  defaultPineAddressHostname: state.settings.defaultPineAddressHostname,
  pineAddressHostname: state.settings.pineAddressHostname
});

class ChangeServerHeaderButtonContainer extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    defaultPineAddressHostname: PropTypes.string,
    pineAddressHostname: PropTypes.string
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _getPineHostname() {
    const { pineAddressHostname, defaultPineAddressHostname } = this.props;
    return pineAddressHostname || defaultPineAddressHostname;
  }

  _onPress() {
    const { navigation } = this.props;
    navigation.navigate('ChangePineServer');
  }

  render() {
    const hostname = this._getPineHostname();

    return (
      <HeaderButton
        label={hostname}
        style={styles.button}
        onPress={this._onPress}
      />
    );
  }
}

const ChangeServerHeaderButtonConnector = connect(
  mapStateToProps
)(ChangeServerHeaderButtonContainer);

export default withNavigation(ChangeServerHeaderButtonConnector);
