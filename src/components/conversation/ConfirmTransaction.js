import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import authentication from '../../authentication';
import Button from '../Button';
import Footer from '../Footer';

const BIOMETRY_TYPE_TOUCH_ID = 'TouchID';
const BIOMETRY_TYPE_FACE_ID = 'FaceID';

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'stretch',
    backgroundColor: '#FAFAFA',
    borderTopColor: '#F0F1F4',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  footer: {
    backgroundColor: 'transparent'
  }
});

export default class ConfirmTransaction extends Component {
  state = {
    biometryType: null
  }

  componentDidMount() {
    // Get the supported biometry authentication type.
    authentication.getSupportedBiometryType().then((biometryType) => {
      this.setState({ biometryType });
    });
  }

  _getButtonLabel() {
    switch (this.state.biometryType) {
      case BIOMETRY_TYPE_TOUCH_ID:
        return 'Pay with Touch ID';

      case BIOMETRY_TYPE_FACE_ID:
        return 'Pay with Face ID';

      default:
        return 'Pay';
    }
  }

  render() {
    return (
      <View style={[styles.view, this.props.style]}>
        <Footer style={styles.footer}>
          <Button
            label={this._getButtonLabel()}
            onPress={() => {}}
            showLoader={true}
            hapticFeedback={true}
          />
        </Footer>
      </View>
    );
  }
}

ConfirmTransaction.propTypes = {
  style: PropTypes.any
};
