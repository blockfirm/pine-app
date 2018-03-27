import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeHaptic from 'react-native-haptic';
import StyledInput from './StyledInput';

const SUCCESS_COLOR = '#33CF8B';
const FAILURE_COLOR = '#FF5A59';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: windowDimensions.height < 600 ? 3 : 4
  },
  number: {
    position: 'absolute',
    top: windowDimensions.height < 600 ? 11 : 12.5,
    left: 13,
    fontFamily: 'Menlo-Regular',
    fontSize: windowDimensions.height < 600 ? 11 : 13,
    color: '#DDDDDF'
  },
  inputContainerStyle: {
    paddingTop: windowDimensions.height < 600 ? 5 : 7
  },
  input: {
    fontFamily: 'Menlo-Regular',
    fontSize: windowDimensions.height < 600 ? 11 : 13,
    letterSpacing: 1,
    width: '100%',
    height: windowDimensions.height < 600 ? 23 : 27,
    padding: 0,
    paddingLeft: windowDimensions.height < 600 ? 17 : 20
  }
});

export default class MnemonicWordInput extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCorrect && !this.props.isCorrect) {
      ReactNativeHaptic.generate('selection');

      // Automatically focus the next input.
      if (this.props.autoTab && this.props.onSubmitEditing) {
        this.props.onSubmitEditing();
      }
    }
  }

  focus() {
    this._input.focus();
  }

  render() {
    const index = this.props.index;
    const returnKeyType = index < 11 ? 'next' : 'done';
    const colorStyle = {};
    let borderColor = null;

    if (this.props.isCorrect === true) {
      colorStyle.color = SUCCESS_COLOR;
      borderColor = SUCCESS_COLOR;
    }

    if (this.props.isIncorrect === true) {
      colorStyle.color = FAILURE_COLOR;
      borderColor = FAILURE_COLOR;
    }

    return (
      <View style={styles.container}>
        <View>
          <StyledInput
            ref={(ref) => { this._input = ref; }}
            style={[styles.input, colorStyle]}
            containerStyle={styles.inputContainerStyle}
            autoCapitalize='none'
            returnKeyType={returnKeyType}
            enforceLowercase={true}
            trim={true}
            borderColor={borderColor}
            onChangeText={this.props.onChangeText}
            onSubmitEditing={this.props.onSubmitEditing}
          />
          <Text style={[styles.number, colorStyle]}>
            {index + 1}.
          </Text>
        </View>
      </View>
    );
  }
}

MnemonicWordInput.propTypes = {
  index: PropTypes.number.isRequired,
  isCorrect: PropTypes.bool,
  isIncorrect: PropTypes.bool,
  autoTab: PropTypes.bool,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func
};
