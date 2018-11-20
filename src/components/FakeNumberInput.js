import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAX_FONT_SIZE = 70;
const FONT_RESIZE_FACTOR = 0.75;
const CARET_HEIGHT_RATIO = 1.2;
const CARET_MARGIN_LEFT_RATIO = 0.0167;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  text: {
    fontSize: MAX_FONT_SIZE,
    fontWeight: '300',
    letterSpacing: -0.1,
    color: '#007AFF'
  },
  placeholder: {
    color: '#C8C7CC'
  },
  caret: {
    height: MAX_FONT_SIZE * CARET_HEIGHT_RATIO,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#426BF2',
    marginLeft: -2
  },
  caretPlaceholder: {
    position: 'absolute',
    marginLeft: -1
  }
});

const reverseString = (string) => {
  return string.split('').reverse().join('');
};

export default class FakeNumberInput extends Component {
  state = {
    fontSize: MAX_FONT_SIZE
  }

  constructor() {
    super(...arguments);

    this._caretAnim = new Animated.Value(1);
    this._onLayout = this._onLayout.bind(this);
  }

  componentDidMount() {
    this._startCaretAnimation();
  }

  componentDidUpdate(prevProps) {
    if (this._animation && prevProps.value !== this.props.value) {
      clearTimeout(this._animationTimeout);

      this._stopCaretAnimation();

      this._animationTimeout = setTimeout(() => {
        this._startCaretAnimation();
      }, 300);
    }
  }

  _startCaretAnimation() {
    this._animation = Animated.loop(
      Animated.sequence([
        Animated.timing(
          this._caretAnim,
          {
            toValue: 0,
            duration: 300,
            easing: Easing.bezier(.215, .61, .355, 1),
            delay: 300,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this._caretAnim,
          {
            toValue: 1,
            duration: 300,
            easing: Easing.bezier(.215, .61, .355, 1),
            delay: 100,
            useNativeDriver: true
          }
        )
      ])
    );

    this._animation.start();
  }

  _stopCaretAnimation() {
    this._animation.stop();
    this._caretAnim.setValue(1);
  }

  _addThousandsSeparators(value) {
    if (!value) {
      return value;
    }

    const parts = value.split('.');
    const integer = parts[0];
    const fractional = parts[1];

    if (!integer || integer.length < 4) {
      return value;
    }

    const reversedInteger = reverseString(integer);
    const maskedReversedInteger = reversedInteger.match(/.{1,3}/g).join(' ');
    const maskedInteger = reverseString(maskedReversedInteger);

    if (fractional === undefined) {
      return maskedInteger;
    }

    return `${maskedInteger}.${fractional}`;
  }

  /**
   * Automatically changes the font size of the number when it grows.
   */
  _onLayout(event) {
    const { width } = event.nativeEvent.layout;
    let { fontSize } = this.state;

    if (width > WINDOW_WIDTH - 100) {
      fontSize = Math.floor(this.state.fontSize * FONT_RESIZE_FACTOR);
    } else if (width < WINDOW_WIDTH - 200) {
      fontSize = Math.ceil(this.state.fontSize / FONT_RESIZE_FACTOR);
    }

    this.setState({
      fontSize: Math.min(fontSize, MAX_FONT_SIZE)
    });
  }

  render() {
    const caretAnim = this._caretAnim;
    const value = this._addThousandsSeparators(this.props.value);
    const { fontSize } = this.state;

    const textStyles = [
      styles.text,
      this.props.color ? { color: this.props.color } : null,
      { fontSize },
      value === '' ? styles.placeholder : null
    ];

    const caretStyles = [
      styles.caret,
      value === '' ? styles.caretPlaceholder : null,
      {
        opacity: caretAnim,
        height: fontSize * CARET_HEIGHT_RATIO,
        marginLeft: -(fontSize * CARET_MARGIN_LEFT_RATIO)
      }
    ];

    return (
      <View style={[styles.view, this.props.style]} onLayout={this._onLayout}>
        <Text style={textStyles}>{value || 0}</Text>
        <Animated.View style={caretStyles} />
      </View>
    );
  }
}

FakeNumberInput.propTypes = {
  style: PropTypes.any,
  color: PropTypes.string,
  value: PropTypes.string
};
