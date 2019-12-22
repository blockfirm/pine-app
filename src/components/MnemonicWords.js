import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, AccessibilityInfo, AppState } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';

import { withTheme } from '../contexts/theme';
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
  revealWrapper: {
    position: 'absolute',
    alignItems: 'center'
  },
  revealView: {
    alignItems: 'center'
  },
  revealIcon: {
    fontSize: 38
  }
});

class MnemonicWords extends Component {
  state = {
    reduceTransparencyEnabled: true
  }

  constructor() {
    super(...arguments);

    this._onReduceTransparencyChanged = this._onReduceTransparencyChanged.bind(this);
    this._onAppStateChange = this._onAppStateChange.bind(this);

    AccessibilityInfo.addEventListener('reduceTransparencyChanged', this._onReduceTransparencyChanged);
    AppState.addEventListener('change', this._onAppStateChange);

    AccessibilityInfo.isReduceTransparencyEnabled().then((reduceTransparencyEnabled) => {
      this.setState({ reduceTransparencyEnabled });
    });
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener('reduceTransparencyChanged', this._onReduceTransparencyChanged);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _onReduceTransparencyChanged(reduceTransparencyEnabled) {
    this.setState({ reduceTransparencyEnabled });
  }

  _onAppStateChange(nextAppState) {
    if (nextAppState !== 'active') {
      this.props.onHide();
    }
  }

  _renderWords(words) {
    return words.map((word, index) => {
      return (
        <MnemonicWord key={index} index={index} word={word} />
      );
    });
  }

  _renderBlur() {
    const { blurStyle, theme } = this.props;
    const { reduceTransparencyEnabled } = this.state;

    if (reduceTransparencyEnabled || theme.name === 'dark') {
      return (
        <View style={[
          styles.blur,
          theme.background,
          blurStyle
        ]} />
      );
    }

    return (
      <BlurView
        style={[styles.blur, blurStyle]}
        blurType='light'
        blurAmount={5}
      />
    );
  }

  _renderRevealButton() {
    const { theme } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.props.onReveal} style={styles.revealWrapper}>
        <View style={styles.revealView}>
          <Icon name='ios-eye' style={[styles.revealIcon, theme.revealMnemonic]} />
          <StyledText style={theme.revealMnemonic}>
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
  onHide: PropTypes.func,
  revealed: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(MnemonicWords);
