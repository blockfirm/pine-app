import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const windowDimensions = Dimensions.get('window');
const FULL_WIDTH = windowDimensions.width;
const DEFAULT_WIDTH = FULL_WIDTH - 80;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD23F',
    width: DEFAULT_WIDTH,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  fullWidth: {
    width: FULL_WIDTH,
    borderRadius: 0,
    bottom: ifIphoneX(-24, 0)
  },
  label: {
    color: 'white',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.41
  },
  disabled: {
    backgroundColor: '#B1AFB7',
    opacity: 0.7
  },
  loader: {
    position: 'absolute',
    height: 12
  }
});

export default class Button extends Component {
  constructor(props) {
    super(...arguments);

    this.state = {
      disabled: props.disabled || false,
      loading: false,
      fullWidth: false
    };
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

  componentWillReceiveProps(nextProps) {
    if (this.props.disabled !== nextProps.disabled) {
      this.setState({
        disabled: nextProps.disabled
      });
    }

    if (this.props.fullWidth !== nextProps.fullWidth) {
      this.setState({
        fullWidth: nextProps.fullWidth
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onPress() {
    const onPress = this.props.onPress;
    const promise = onPress ? onPress() : null;

    if (promise instanceof Promise === false) {
      return;
    }

    this.setState({
      disabled: true,
      loading: true
    });

    promise.then(() => {
      if (!this._isMounted) {
        return;
      }

      // Delay hiding the loading indicator to prevent flickering.
      setTimeout(() => {
        this.setState({
          disabled: false,
          loading: false
        });
      }, 500);
    });
  }

  render() {
    const { disabled, loading } = this.state;
    const loaderColor = this.props.loaderColor || '#FFFFFF';

    const buttonStyles = [
      styles.button,
      this.props.style
    ];

    if (disabled) {
      buttonStyles.push(styles.disabled);
      buttonStyles.push(this.props.disabledStyle);
    }

    if (this.state.fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    return (
      <TouchableOpacity disabled={disabled} activeOpacity={0.7} onPress={this._onPress.bind(this)}>
        <View style={buttonStyles}>
          <ActivityIndicator animating={loading} color={loaderColor} style={styles.loader} size='small' />
          <Text style={[styles.label, this.props.labelStyle, { opacity: loading ? 0 : 1 }]}>
            {this.props.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  disabledStyle: PropTypes.any,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loaderColor: PropTypes.string
};
