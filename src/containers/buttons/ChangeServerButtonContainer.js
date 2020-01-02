import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import ChangeServerButton from '../../components/buttons/ChangeServerButton';

class ChangeServerButtonContainer extends Component {
  static propTypes = {
    navigation: PropTypes.any
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    const { navigation } = this.props;
    navigation.navigate('ChangePineServer');
  }

  render() {
    return (
      <ChangeServerButton
        {...this.props}
        onPress={this._onPress}
      />
    );
  }
}

export default withNavigation(ChangeServerButtonContainer);
