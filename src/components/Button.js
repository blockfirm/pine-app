import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { LinearTextGradient } from 'react-native-text-gradient';

const windowDimensions = Dimensions.get('window');
const FULL_WIDTH = windowDimensions.width;
const DEFAULT_WIDTH = FULL_WIDTH - 80;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F6F6F6',
    width: DEFAULT_WIDTH,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    shadowRadius: 4
  },
  fullWidth: {
    width: FULL_WIDTH,
    borderRadius: 0,
    bottom: ifIphoneX(-24, 0)
  },
  label: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.41
  },
  disabled: {
    opacity: 0.4,
    color: '#7A7A7A'
  },
  loader: {
    height: 12,
    position: 'absolute',
    top: 15,
    left: 15
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

      this.setState({
        disabled: false,
        loading: false
      });
    });
  }

  render() {
    const { disabled, loading } = this.state;
    const label = loading ? this.props.loadingLabel : this.props.label;

    const buttonStyles = [
      styles.button,
      this.props.style
    ];

    let gradientTextProps = {
      colors: ['#8069DC', '#4874B3'],
      locations: [0.3, 1],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 }
    };

    if (disabled) {
      buttonStyles.push(styles.disabled);
      gradientTextProps = {};
    }

    if (this.state.fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    return (
      <TouchableOpacity disabled={disabled} activeOpacity={0.7} onPress={this._onPress.bind(this)}>
        <View style={buttonStyles}>
          <ActivityIndicator animating={loading} color='#7A7A7A' style={styles.loader} size='small' />
          <LinearTextGradient
            {...gradientTextProps}
            style={styles.label}
          >
            {label.toUpperCase()}
          </LinearTextGradient>
        </View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.any,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool
};
