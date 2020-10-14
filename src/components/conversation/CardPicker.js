import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { withTheme } from '../../contexts/theme';
import Card from './Card';
import CardPickerItem from './CardPickerItem';

const WINDOW_WIDTH = Dimensions.get('window').width;
const CARD_INNER_BORDER_WIDTH = 2;
const CARD_SELECTED_BORDER_WIDTH = 2.5;
const CARD_MARGIN = 5 - CARD_SELECTED_BORDER_WIDTH - CARD_INNER_BORDER_WIDTH;

const CARDS = [
  Card.CARD_MOON_AND_BACK,
  Card.CARD_DONUT_SPEND_IT_ALL,
  Card.CARD_HAPPY_BIRTHDAY,
  Card.CARD_ENJOY_THE_RIDE,
  Card.CARD_PIZZA_OR_FORTUNE,
  Card.CARD_TAKE_MY_BITCOIN,
  Card.CARD_THANK_YOU_THIS_MUCH,
  Card.CARD_HAPPY_BITCOINING
];

const styles = StyleSheet.create({
  view: {
    alignSelf: 'stretch'
  },
  carousel: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'visible'
  }
});

class CardPicker extends PureComponent {
  _getCardSize() {
    return this.props.height - 25;
  }

  _getCardSizeWithBorders() {
    const cardSize = this._getCardSize();
    return cardSize + CARD_SELECTED_BORDER_WIDTH * 2 + CARD_INNER_BORDER_WIDTH * 2;
  }

  _getCardSizeWithMargins() {
    const cardSizeWithBorders = this._getCardSizeWithBorders();
    return cardSizeWithBorders + CARD_MARGIN * 2;
  }

  _onMomentumScrollBegin(event) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    if (contentOffset.x > 0 && contentOffset.x + layoutMeasurement.width < contentSize.width) {
      ReactNativeHaptic.generate('selection');
    }
  }

  _onSelectCard(selectedCard) {
    ReactNativeHaptic.generate('selection');

    if (selectedCard === this.props.selectedCard) {
      this.props.onSelectCard(null);
    } else {
      this.props.onSelectCard(selectedCard);
    }
  }

  _renderCard({ item }) {
    const { selectedCard } = this.props;
    const { card } = item;
    const size = this._getCardSize();

    return (
      <CardPickerItem
        card={card}
        size={size}
        innerBorderWidth={CARD_INNER_BORDER_WIDTH}
        selectedBorderWidth={CARD_SELECTED_BORDER_WIDTH}
        margin={CARD_MARGIN}
        isSelected={selectedCard === card}
        onSelect={this._onSelectCard.bind(this)}
      />
    );
  }

  render() {
    const { theme, pointerEvents } = this.props;
    const cardSizeWithMargins = this._getCardSizeWithMargins();
    const cards = CARDS.map((card, index) => ({ key: index, card }));

    const style = [
      styles.view,
      { backgroundColor: theme.palette.background },
      this.props.style
    ];

    return (
      <Animated.View style={style} pointerEvents={pointerEvents}>
        <FlatList
          bounces={true}
          getItemLayout={(data, index) => ({
            length: cardSizeWithMargins,
            offset: cardSizeWithMargins * index,
            index
          })}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          snapToInterval={cardSizeWithMargins}
          snapToAlignment='center'
          decelerationRate='fast'
          horizontal={true}
          style={styles.carousel}
          data={cards}
          renderItem={this._renderCard.bind(this)}
          keyExtractor={item => item.card}
          initialScrollIndex={0}
          contentInset={{ left: 15 - CARD_MARGIN, right: 15 - CARD_MARGIN }}
          contentOffset={{ x: cardSizeWithMargins * 1.5 - WINDOW_WIDTH / 2 }}
          onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
        />
      </Animated.View>
    );
  }
}

CardPicker.propTypes = {
  theme: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.any,
  selectedCard: PropTypes.oneOf(Card.CARDS),
  onSelectCard: PropTypes.func.isRequired,
  pointerEvents: PropTypes.string
};

CardPicker.defaultProps = {
  height: 300
};

export default withTheme(CardPicker);
