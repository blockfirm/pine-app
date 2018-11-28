import React, { Component } from 'react';
import { StyleSheet, View, Animated, Easing, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import ToolTip from 'react-native-tooltip';
import AutoFontSize from './AutoFontSize';

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
    fontWeight: '300',
    letterSpacing: -0.1,
    color: '#007AFF'
  },
  placeholder: {
    color: '#C8C7CC'
  },
  caret: {
    height: AutoFontSize.MAX_FONT_SIZE * CARET_HEIGHT_RATIO,
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
    fontSize: AutoFontSize.MAX_FONT_SIZE
  }

  constructor() {
    super(...arguments);

    this._caretAnim = new Animated.Value(1);
    this._onFontResize = this._onFontResize.bind(this);
    this._onPaste = this._onPaste.bind(this);
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

  _onPaste() {
    if (!this.props.onPaste) {
      return;
    }

    Clipboard.getString().then((string) => {
      const number = parseFloat(string);

      if (!isNaN(number) && number > 0) {
        this.props.onPaste(number.toString());
      }
    });
  }

  _onFontResize(fontSize) {
    this.setState({ fontSize });
  }

  render() {
    const caretAnim = this._caretAnim;
    const value = this._addThousandsSeparators(this.props.value);
    const { fontSize } = this.state;

    const textStyles = [
      styles.text,
      this.props.color ? { color: this.props.color } : null,
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
      <View style={[styles.view, this.props.style]}>
        <ToolTip
          actions={[
            { text: 'Paste', onPress: this._onPaste }
          ]}
          underlayColor='white'
          activeOpacity={1}
        >
          <AutoFontSize onFontResize={this._onFontResize} style={textStyles}>
            {value || 0}
          </AutoFontSize>
        </ToolTip>
        <Animated.View style={caretStyles} />
      </View>
    );
  }
}

FakeNumberInput.propTypes = {
  style: PropTypes.any,
  color: PropTypes.string,
  value: PropTypes.string,
  onPaste: PropTypes.func
};
