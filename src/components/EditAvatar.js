import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';

import Avatar from './Avatar';
import StyledText from './StyledText';

const AVATAR_SIZE = 80;
const IMAGE_SIZE = 250;
const IMAGE_QUALITY = 0.8;

const styles = StyleSheet.create({
  wrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 100,
    overflow: 'hidden'
  },
  editWrapper: {
    backgroundColor: 'black',
    width: AVATAR_SIZE,
    position: 'absolute',
    bottom: 0,
    paddingVertical: 3
  },
  editText: {
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  loaderOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default class EditAvatar extends Component {
  state = {
    loading: false
  }

  _selectAvatar() {
    if (this.state.loading) {
      return;
    }

    const options = {
      title: '',
      mediaType: 'photo',
      allowsEditing: true,
      maxWidth: IMAGE_SIZE,
      maxHeight: IMAGE_SIZE,
      quality: IMAGE_QUALITY
    };

    ImagePicker.showImagePicker(options, (response) => {
      const promise = this.props.onSelect(response);

      if (promise instanceof Promise) {
        this.setState({ loading: true });

        promise.finally(() => {
          this.setState({ loading: false });
        });
      }
    });
  }

  _renderEditOverlay() {
    if (this.state.loading) {
      return;
    }

    return (
      <View style={styles.editWrapper}>
        <StyledText style={styles.editText}>Edit</StyledText>
      </View>
    );
  }

  _renderLoader() {
    if (!this.state.loading) {
      return;
    }

    return (
      <View style={styles.loaderOverlay}>
        <ActivityIndicator animating={true} color='#FFFFFF' size='small' />
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity onPress={this._selectAvatar.bind(this)}>
        <View style={styles.wrapper}>
          <Avatar size={AVATAR_SIZE} />
          {this._renderEditOverlay()}
          {this._renderLoader()}
        </View>
      </TouchableOpacity>
    );
  }
}

EditAvatar.propTypes = {
  onSelect: PropTypes.func
};
