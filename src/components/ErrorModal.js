import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, LayoutAnimation, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { VibrancyView } from 'react-native-blur';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHaptic from 'react-native-haptic';

import StyledText from '../components/StyledText';
import Paragraph from '../components/Paragraph';

const windowDimensions = Dimensions.get('window');
const MODAL_MARGIN = 20;
const MODAL_WIDTH = windowDimensions.width - MODAL_MARGIN * 2;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1
  },
  modal: {
    width: MODAL_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    marginTop: 0
  },
  modalHeader: {
    backgroundColor: '#FFD6D6',
    padding: 15,
    paddingTop: 17,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  modalHeaderText: {
    color: '#FF5A59',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  modalHeaderIcon: {
    fontSize: 28
  },
  modalBody: {
    padding: 25,
    paddingLeft: 30,
    paddingRight: 30
  },
  modalBodyText: {
    marginBottom: 0
  },
  modalButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#fbfbfb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  modalButtonText: {
    color: '#322A51',
    fontWeight: '600',
    letterSpacing: 1
  }
});

export default class ErrorModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      LayoutAnimation.spring();

      if (nextProps.error) {
        ReactNativeHaptic.generate('notificationError');
      }
    }
  }

  render() {
    const error = this.props.error;
    const message = error ? error.message : '';
    const backdropStyles = [styles.backdrop];
    const modalStyles = [styles.modal];
    let pointerEvents = 'auto';

    if (!error) {
      pointerEvents = 'none';

      backdropStyles.push({
        opacity: 0
      });

      modalStyles.push({
        opacity: 0,
        marginTop: -500
      });
    }

    return (
      <View style={styles.wrapper} pointerEvents={pointerEvents}>
        <VibrancyView blurType='dark' blurAmount={5} style={backdropStyles} pointerEvents={pointerEvents} />

        <View style={modalStyles}>
          <View style={styles.modalHeader}>
            <StyledText style={styles.modalHeaderText}>
              <Icon name='ios-alert' style={styles.modalHeaderIcon} />
            </StyledText>
          </View>

          <View style={styles.modalBody}>
            <Paragraph style={styles.modalBodyText}>{message}</Paragraph>
          </View>

          <View>
            <TouchableHighlight style={styles.modalButton} underlayColor='#fbfbfb' onPress={this.props.onDismiss}>
              <Text>
                <StyledText style={styles.modalButtonText}>OK</StyledText>
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

ErrorModal.propTypes = {
  error: PropTypes.instanceOf(Error),
  onDismiss: PropTypes.func
};
