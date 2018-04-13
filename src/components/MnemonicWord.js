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
    backgroundColor: '#F8F8F8',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 30,
    padding: 11,
    paddingLeft: 12
  },
  number: {
    position: 'absolute',
    top: 11,
    left: 5,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999999',
    width: 20,
    textAlign: 'right'
  },
  word: {
    fontFamily: 'Menlo-Regular',
    fontSize: 11,
    color: '#999999',
    paddingLeft: 17
  }
});

export default class MnemonicWord extends Component {
  render() {
    const index = this.props.index;
    const word = this.props.word;

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <StyledText style={styles.number}>
            {index + 1}.
          </StyledText>
          <StyledText style={styles.word}>
            {word}
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
