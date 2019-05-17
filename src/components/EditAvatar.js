import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

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
    width: AVATAR_SIZE,
    position: 'absolute',
    bottom: 0,
    paddingVertical: 3
  },
  editText: {
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600'
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

  _cropAvatar(image) {
    const options = {
      path: image.uri,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      includeBase64: true,
      cropperCircleOverlay: true,
      compressImageQuality: IMAGE_QUALITY
    };

    ImageCropPicker.openCropper(options)
      .then((croppedImage) => {
        const promise = this.props.onSelect(croppedImage);

        if (promise instanceof Promise) {
          this.setState({ loading: true });

          promise.finally(() => {
            this.setState({ loading: false });
          });
        }
      })
      .catch((error) => {
        if (error.code === 'E_PICKER_CANCELLED') {
          // User cancelled cropping, suppress error.
          return;
        }

        throw error;
      });
  }

  _onSelectAvatar(response) {
    if (response.error) {
      return this.props.onSelect(null, new Error(response.error));
    }

    if (response.didCancel) {
      return;
    }

    this._cropAvatar(response);
  }

  _selectAvatar() {
    if (this.state.loading) {
      return;
    }

    const options = {
      title: '',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose Photo',
      mediaType: 'photo',
      cameraType: 'front',
      allowsEditing: false,
      quality: IMAGE_QUALITY,
      noData: true
    };

    ImagePicker.showImagePicker(options, this._onSelectAvatar.bind(this));
  }

  _renderEditOverlay() {
    if (this.state.loading) {
      return;
    }

    return (
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.6)']}
        style={styles.editWrapper}
      >
        <StyledText style={styles.editText}>Edit</StyledText>
      </LinearGradient>
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
    const { pineAddress, checksum } = this.props;

    return (
      <TouchableOpacity onPress={this._selectAvatar.bind(this)}>
        <View style={styles.wrapper}>
          <Avatar size={AVATAR_SIZE} pineAddress={pineAddress} checksum={checksum} />

          {this._renderEditOverlay()}
          {this._renderLoader()}
        </View>
      </TouchableOpacity>
    );
  }
}

EditAvatar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  pineAddress: PropTypes.string,
  checksum: PropTypes.string
};
