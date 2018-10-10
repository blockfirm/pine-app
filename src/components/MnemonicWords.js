import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';
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
    top: -50,
    bottom: -50,
    left: -10,
    right: -10
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
    fontSize: 48
  },
  revealText: {
    color: '#007AFF'
  }
});

export default class MnemonicWords extends Component {
  _renderWords(words) {
    return words.map((word, index) => {
      return (
        <MnemonicWord key={index} index={index} word={word} />
      );
    });
  }

  _renderBlur() {
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
