import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    width: '49%',
    padding: 4
  },
  wrapper: {
    backgroundColor: '#fbfbfb',
    borderColor: '#DDDDDF',
    borderWidth: 1,
    borderRadius: 30,
    padding: 7,
    paddingLeft: 12
  },
  word: {
    fontFamily: 'Menlo-Regular',
    fontSize: 11
  }
});

export default class MnemonicWord extends Component {
  render() {
    const index = this.props.index;
    const word = this.props.word;

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <StyledText style={styles.word}>
            {index + 1}. {word}
          </StyledText>
        </View>
      </View>
    );
  }
}

MnemonicWord.propTypes = {
  index: PropTypes.number.isRequired,
  word: PropTypes.string.isRequired
};
