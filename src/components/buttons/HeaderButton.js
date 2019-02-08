import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingRight: 16
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: '#007AFF'
  },
  disabled: {
    color: '#E2E2E2'
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 1
  }
});

export default class HeaderButton extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
    /*
     * HACK: The promise from onPress might resolve and try to update state
     * after this component has been unmounted which leads to a warning.
     * One solution is to wrap the promise but this "hack" is easier in
     * this case.
     * <https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html>
     */
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handleOnPress() {
    const promise = this.props.onPress();

    if (promise instanceof Promise === false) {
      return;
    }

    this.setState({ loading: true });

    promise.finally(() => {
      // Delay hiding the loading indicator to prevent flickering.
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ loading: false });
        }
      }, 500);
    });
  }

  render() {
    const { disabled } = this.props;
    const { loading } = this.state;

    const textStyles = [
      styles.text,
      disabled ? styles.disabled : undefined,
      { opacity: loading ? 0 : 1 }
    ];

    return (
      <TouchableOpacity onPress={this._handleOnPress.bind(this)} disabled={disabled} style={styles.button}>
        <View>
          <ActivityIndicator animating={loading} style={styles.loader} size='small' />
          <StyledText style={textStyles}>
            {this.props.label}
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  }
}

HeaderButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};
