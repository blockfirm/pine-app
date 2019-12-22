import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
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
    width: windowDimensions.width < 330 ? 240 : 278,
    height: 27
  }
});

class StyledInput extends Component {
  constructor(props) {
    super(...arguments);

    this.state = {
      value: props.value,
      borderColor: props.theme.input.borderColor
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  _onFocus() {
    const { theme } = this.props;

    this.setState({
      borderColor: theme.inputFocus.borderColor
    });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  _onBlur() {
    const { theme } = this.props;

    this.setState({
      borderColor: theme.input.borderColor
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
    const { theme } = this.props;
    const editable = !this.props.disabled;

    const borderColor = {
      borderColor: this.props.borderColor || this.state.borderColor
    };

    const containerStyle = [
      styles.container,
      { backgroundColor: theme.input.backgroundColor },
      this.props.containerStyle,
      borderColor
    ];

    return (
      <View style={containerStyle}>
        <TextInput
          {...this.props}
          ref={(ref) => { this._input = ref; }}
          style={[styles.input, theme.text, this.props.style]}
          autoCorrect={false}
          value={this.state.value}
          enablesReturnKeyAutomatically={true}
          editable={editable}
          onFocus={this._onFocus.bind(this)}
          onBlur={this._onBlur.bind(this)}
          onChangeText={(text) => this._onChangeText(text)}
        />
      </View>
    );
  }
}

StyledInput.propTypes = {
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  value: PropTypes.string,
  enforceLowercase: PropTypes.bool,
  trim: PropTypes.bool,
  borderColor: PropTypes.string,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  theme: PropTypes.object.isRequired
};

export default withTheme(StyledInput);
