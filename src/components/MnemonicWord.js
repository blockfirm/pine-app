import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    width: '49%',
    padding: 4
  },
  wrapper: {
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
    width: 20,
    textAlign: 'right'
  },
  word: {
    fontFamily: 'Menlo-Regular',
    fontSize: 11,
    paddingLeft: 17
  }
});

class MnemonicWord extends Component {
  render() {
    const { index, word, theme } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.wrapper, theme.mnemonicWordWrapper]}>
          <StyledText style={[styles.number, theme.mnemonicWordNumber]}>
            {index + 1}.
          </StyledText>
          <StyledText style={[styles.word, theme.mnemonicWord]}>
            {word}
          </StyledText>
        </View>
      </View>
    );
  }
}

MnemonicWord.propTypes = {
  index: PropTypes.number.isRequired,
  word: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(MnemonicWord);
