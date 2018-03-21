import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MnemonicWord from './MnemonicWord';

const styles = StyleSheet.create({
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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

  render() {
    const phrase = this.props.phrase;
    const words = phrase.split(' ');

    return (
      <View style={[styles.list, this.props.style]}>
        {this._renderWords(words)}
      </View>
    );
  }
}

MnemonicWords.propTypes = {
  phrase: PropTypes.string.isRequired,
  style: PropTypes.any
};
