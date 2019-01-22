import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { DECIMAL_SEPARATOR } from '../localization';
import DeleteIcon from './icons/keyboard/DeleteIcon';

const WINDOW_WIDTH = Dimensions.get('window').width;
const KEY_WIDTH = WINDOW_WIDTH / 3;
const KEY_HEIGHT = KEY_WIDTH * 0.424;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    paddingBottom: ifIphoneX(74, 0),
    backgroundColor: '#FAFAFA',
    borderColor: '#DEDDE0',
    borderTopWidth: 1
  },
  keyWrapper: {
    width: KEY_WIDTH,
    height: KEY_HEIGHT,
    borderColor: '#EEEEEE',
    borderBottomWidth: 1
  },
  key: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyLabel: {
    color: '#797979',
    fontSize: 25
  },
  left: {
    borderRightWidth: 1
  },
  right: {
    borderLeftWidth: 1
  }
});

export default class NumberPad extends Component {
  _renderKey(label, style) {
    const getOnPressHandler = () => {
      return () => {
        this.props.onInput(label);
      };
    };

    return (
      <View key={label} style={[styles.keyWrapper, style]}>
        <TouchableHighlight
          onPress={getOnPressHandler()}
          style={styles.key}
          underlayColor='#F3F3F4'
        >
          <Text style={styles.keyLabel}>{label}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _renderDeleteKey() {
    const getOnPressHandler = (isLongPress) => {
      return () => {
        this.props.onDelete(isLongPress);
      };
    };

    return (
      <View key='del' style={[styles.keyWrapper, styles.right]}>
        <TouchableHighlight
          onPress={getOnPressHandler()}
          onLongPress={getOnPressHandler(true)}
          style={styles.key}
          underlayColor='#F3F3F4'
        >
          <DeleteIcon />
        </TouchableHighlight>
      </View>
    );
  }

  _renderKeys() {
    return [
      this._renderKey('1', styles.left),
      this._renderKey('2'),
      this._renderKey('3', styles.right),

      this._renderKey('4', styles.left),
      this._renderKey('5'),
      this._renderKey('6', styles.right),

      this._renderKey('7', styles.left),
      this._renderKey('8'),
      this._renderKey('9', styles.right),

      this._renderKey(DECIMAL_SEPARATOR, styles.left),
      this._renderKey('0'),
      this._renderDeleteKey()
    ];
  }

  render() {
    return (
      <View style={styles.view}>
        {this._renderKeys()}
      </View>
    );
  }
}

NumberPad.propTypes = {
  onInput: PropTypes.func,
  onDelete: PropTypes.func
};
