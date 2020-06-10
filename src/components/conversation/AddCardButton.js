import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';

import AddCardIcon from '../icons/AddCardIcon';
import PlusIconAddOn from '../icons/addons/PlusIconAddOn';
import CheckIconAddOn from '../icons/addons/CheckIconAddOn';

const styles = StyleSheet.create({
  plusAddOn: {
    position: 'absolute',
    top: 8,
    left: 9
  },
  checkAddOn: {
    position: 'absolute',
    top: 8,
    left: 9
  }
});

class AddCardButton extends PureComponent {
  state = {
    plusAnim: new Animated.Value(1),
    checkAnim: new Animated.Value(0)
  };

  componentDidUpdate(prevProps) {
    if (prevProps.checked && !this.props.checked) {
      this._hideAddOn(this.state.checkAnim);
      this._showAddOn(this.state.plusAnim);
    }

    if (!prevProps.checked && this.props.checked) {
      this._hideAddOn(this.state.plusAnim);
      this._showAddOn(this.state.checkAnim);
    }
  }

  _showAddOn(animated) {
    Animated.spring(animated, {
      toValue: 1,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  _hideAddOn(animated) {
    Animated.spring(animated, {
      toValue: 0,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  render() {
    const { style, active, onPress } = this.props;
    const { plusAnim, checkAnim } = this.state;

    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View>
          <AddCardIcon active={active} />

          <Animated.View style={[styles.plusAddOn, { transform: [{ scale: plusAnim }] }]}>
            <PlusIconAddOn />
          </Animated.View>

          <Animated.View style={[styles.checkAddOn, { transform: [{ scale: checkAnim }] }]}>
            <CheckIconAddOn />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  }
}

AddCardButton.propTypes = {
  style: PropTypes.any,
  active: PropTypes.bool,
  checked: PropTypes.bool,
  onPress: PropTypes.func
};

AddCardButton.defaultProps = {
  active: false,
  checked: false
};

export default AddCardButton;
