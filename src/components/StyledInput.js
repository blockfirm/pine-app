import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const BORDER_COLOR = '#DADADA';
const BORDER_COLOR_FOCUS = '#3FA7D6';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 17,
    paddingTop: 7,
    paddingBottom: 3,
    borderRadius: 27,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 5
  },
  input: {
    fontSize: windowDimensions.width < 330 ? 11 : 13,
    letterSpacing: 1.45,
    color: '#000000',
    width: windowDimensions.width < 330 ? 240 : 278,
    height: 27
  }
});

export default class StyledInput extends Component {
  constructor(props) {
    super(...arguments);

    this.state = {
      value: props.value,
      borderColor: BORDER_COLOR
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  _onFocus() {
    this.setState({
      borderColor: BORDER_COLOR_FOCUS
    });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  _onBlur() {
    this.setState({
      borderColor: BORDER_COLOR
    });
  }

  _onChangeText(text) {
    let value = text;

    value = this.props.enforceLowercase ? value.toLowerCase() : value;
    value = this.props.trim ? value.trim() : value;

    this.setState({ value });

    if (this.props.onChangeText) {
      this.props.onChangeText(value);
    }
  }

  focus() {
    this._input.focus();
  }

  render() {
    const borderColor = {
      borderColor: this.props.borderColor || this.state.borderColor
    };

    return (
      <View style={[styles.container, this.props.containerStyle, borderColor]}>
        <TextInput
          ref={(ref) => { this._input = ref; }}
          style={[styles.input, this.props.style]}
          autoCorrect={false}
          autoCapitalize={this.props.autoCapitalize}
          value={this.state.value}
          placeholder={this.props.placeholder}
          placeholderTextColor={BORDER_COLOR}
          selectionColor={BORDER_COLOR_FOCUS}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          enablesReturnKeyAutomatically={true}
          onFocus={this._onFocus.bind(this)}
          onBlur={this._onBlur.bind(this)}
          onChangeText={(text) => this._onChangeText(text)}
          onSubmitEditing={this.props.onSubmitEditing}
        />
      </View>
    );
  }
}

StyledInput.propTypes = {
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  autoCapitalize: PropTypes.string,
  keyboardType: PropTypes.string,
  returnKeyType: PropTypes.string,
  enforceLowercase: PropTypes.bool,
  trim: PropTypes.bool,
  borderColor: PropTypes.string,
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func
};
