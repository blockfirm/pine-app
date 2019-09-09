import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, AccessibilityInfo } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';

import MnemonicWord from './MnemonicWord';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  blur: {
    position: 'absolute',
    top: -30,
    bottom: -30,
    left: -10,
    right: -10
  },
  whiteBackground: {
    backgroundColor: 'white'
  },
  revealWrapper: {
    position: 'absolute',
    alignItems: 'center'
  },
  revealView: {
    alignItems: 'center'
  },
  revealIcon: {
    color: '#007AFF',
    fontSize: 38
  },
  revealText: {
    color: '#007AFF'
  }
});

export default class MnemonicWords extends Component {
  state = {
    reduceTransparencyEnabled: true
  }

  constructor() {
    super(...arguments);

    this._onReduceTransparencyChanged = this._onReduceTransparencyChanged.bind(this);
    AccessibilityInfo.addEventListener('reduceTransparencyChanged', this._onReduceTransparencyChanged);

    AccessibilityInfo.isReduceTransparencyEnabled().then((reduceTransparencyEnabled) => {
      this.setState({ reduceTransparencyEnabled });
    });
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener('reduceTransparencyChanged', this._onReduceTransparencyChanged);
  }

  _onReduceTransparencyChanged(reduceTransparencyEnabled) {
    this.setState({ reduceTransparencyEnabled });
  }

  _renderWords(words) {
    return words.map((word, index) => {
      return (
        <MnemonicWord key={index} index={index} word={word} />
      );
    });
  }

  _renderBlur() {
    const { reduceTransparencyEnabled } = this.state;

    if (reduceTransparencyEnabled) {
      return (
        <View style={[
          styles.blur,
          styles.whiteBackground,
          this.props.blurStyle
        ]} />
      );
    }

    return (
      <BlurView
        style={[styles.blur, this.props.blurStyle]}
        blurType='light'
        blurAmount={5}
      />
    );
  }

  _renderRevealButton() {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.props.onReveal} style={styles.revealWrapper}>
        <View style={styles.revealView}>
          <Icon name='ios-eye' style={styles.revealIcon} />
          <StyledText style={styles.revealText}>
            Reveal Recovery Key
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const phrase = this.props.phrase;
    const words = phrase.split(' ');

    return (
      <View style={[styles.list, this.props.style]}>
        {this._renderWords(words)}

        {this.props.revealed ? null : this._renderBlur()}
        {this.props.revealed ? null : this._renderRevealButton()}
      </View>
    );
  }
}

MnemonicWords.propTypes = {
  phrase: PropTypes.string.isRequired,
  style: PropTypes.any,
  blurStyle: PropTypes.any,
  onReveal: PropTypes.func,
  revealed: PropTypes.bool
};
