import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';

import { withTheme } from '../../contexts/theme';
import Card from './Card';

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center'
  },
  selectedBorder: {
    borderRadius: 12
  },
  card: {
    borderRadius: 10
  }
});

class CardPickerItem extends PureComponent {
  state = {
    scale: new Animated.Value(1)
  };

  _getSizeWithBorders() {
    const { size, innerBorderWidth, selectedBorderWidth } = this.props;
    return size + innerBorderWidth * 2 + selectedBorderWidth * 2;
  }

  _getSizeWithMargins() {
    const { margin } = this.props;
    const sizeWithBorders = this._getSizeWithBorders();

    return sizeWithBorders + margin * 2;
  }

  _onSelect(card) {
    this.props.onSelect(card);
  }

  _onPressIn() {
    Animated.spring(this.state.scale, {
      toValue: 1.01,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  _onPressOut() {
    Animated.spring(this.state.scale, {
      toValue: 1,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  render() {
    const {
      theme,
      card,
      size,
      innerBorderWidth,
      selectedBorderWidth,
      margin,
      isSelected
    } = this.props;

    const sizeWithMargins = this._getSizeWithMargins();

    const scaleStyle = {
      transform: [{ scale: this.state.scale }]
    };

    const containerStyle = [
      styles.cardContainer,
      {
        width: sizeWithMargins,
        paddingHorizontal: margin
      },
      scaleStyle
    ];

    const selectedBorderStyle = [
      styles.selectedBorder,
      {
        borderColor: theme.palette.background,
        borderWidth: selectedBorderWidth
      },
      isSelected && theme.cardSelected
    ];

    const cardStyle = [
      styles.card,
      {
        width: size + innerBorderWidth * 2,
        height: size + innerBorderWidth * 2,
        borderColor: theme.palette.background,
        borderWidth: innerBorderWidth
      }
    ];

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={this._onSelect.bind(this, card)}
          onPressIn={this._onPressIn.bind(this)}
          onPressOut={this._onPressOut.bind(this)}
        >
          <Animated.View style={containerStyle}>
            <View style={selectedBorderStyle}>
              <Card card={card} style={cardStyle} size={size} />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

CardPickerItem.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.number.isRequired,
  innerBorderWidth: PropTypes.number.isRequired,
  selectedBorderWidth: PropTypes.number.isRequired,
  margin: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  style: PropTypes.any,
  card: PropTypes.oneOf(Card.CARDS)
};

CardPickerItem.defaultProps = {
  isSelected: false
};

export default withTheme(CardPickerItem);
