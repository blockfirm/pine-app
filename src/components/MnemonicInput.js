import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MnemonicWordInput from './MnemonicWordInput';

const styles = StyleSheet.create({
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default class MnemonicInput extends Component {
  _inputs = []

  constructor(props) {
    super(...arguments);

    const correctWords = props.correctPhrase ? props.correctPhrase.split(' ') : [];

    this.state = {
      words: [],
      correctWords
    };
  }

  _onChangeText(index, text) {
    const words = this.state.words;

    words[index] = text;
    this.setState({ words });

    if (this.props.onChange) {
      const phrase = words
        .join(' ')
        .toLowerCase();

      this.props.onChange(phrase);
    }
  }

  _onSubmitEditing(index) {
    const input = this._inputs[index + 1];

    if (input) {
      return input.focus();
    }
  }

  _renderInput(index) {
    const word = this.state.words[index];
    const correctWord = this.state.correctWords[index];
    const wordList = this.props.wordList;
    const autoTab = correctWord !== undefined;
    let isCorrect = false;
    let isIncorrect = false;

    if (word) {
      if (correctWord) {
        isCorrect = word === correctWord;
        isIncorrect = correctWord.indexOf(word) !== 0;
      } else if (wordList) {
        isCorrect = wordList.includes(word);
      }
    }

    return (
      <MnemonicWordInput
        ref={(ref) => { this._inputs[index] = ref; }}
        key={index}
        index={index}
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        autoTab={autoTab}
        disabled={this.props.disabled}
        onChangeText={this._onChangeText.bind(this, index)}
        onSubmitEditing={this._onSubmitEditing.bind(this, index)}
      />
    );
  }

  _renderInputs() {
    const inputs = [];

    for (let index = 0; index < 12; index++) {
      inputs.push(this._renderInput(index));
    }

    return inputs;
  }

  render() {
    return (
      <View style={[styles.list, this.props.style]}>
        {this._renderInputs()}
      </View>
    );
  }
}

MnemonicInput.propTypes = {
  style: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  correctPhrase: PropTypes.string,
  wordList: PropTypes.array
};
