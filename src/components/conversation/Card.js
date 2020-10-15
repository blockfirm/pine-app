import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const IMAGE_PLACEHOLDER = require('../../images/cards/CardPlaceholder.png');
const IMAGE_NOT_FOUND = require('../../images/cards/CardNotFound.png');
const IMAGE_DONUT_SPEND_IT_ALL = require('../../images/cards/DonutSpendItAllCard.jpg');
const IMAGE_HAPPY_BIRTHDAY = require('../../images/cards/HappyBirthdayCard.jpg');
const IMAGE_MOON_AND_BACK = require('../../images/cards/MoonAndBackCard.jpg');
const IMAGE_ENJOY_THE_RIDE = require('../../images/cards/EnjoyTheRideCard.jpg');
const IMAGE_PIZZA_OR_FORTUNE = require('../../images/cards/PizzaOrFortuneCard.jpg');
const IMAGE_TAKE_MY_BITCOIN = require('../../images/cards/TakeMyBitcoinCard.jpg');
const IMAGE_THANK_YOU_THIS_MUCH = require('../../images/cards/ThankYouThisMuchCard.jpg');
const IMAGE_HAPPY_BITCOINING = require('../../images/cards/HappyBitcoiningCard.jpg');
const IMAGE_WELCOME_TO_PINE = require('../../images/cards/WelcomeToPineCard.jpg');
const IMAGE_HAPPY_HALLOWEEN = require('../../images/cards/HappyHalloweenCard.jpg');

const BLUR_TYPE_LIGHT = 'light';
const BLUR_TYPE_DARK = 'dark';

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0'
  }
});

export default class Card extends Component {
  static CARD_PLACEHOLDER = 'PLACEHOLDER';
  static CARD_DONUT_SPEND_IT_ALL = 'DONUT_SPEND_IT_ALL';
  static CARD_HAPPY_BIRTHDAY = 'HAPPY_BIRTHDAY';
  static CARD_MOON_AND_BACK = 'MOON_AND_BACK';
  static CARD_ENJOY_THE_RIDE = 'ENJOY_THE_RIDE';
  static CARD_PIZZA_OR_FORTUNE = 'PIZZA_OR_FORTUNE';
  static CARD_TAKE_MY_BITCOIN = 'TAKE_MY_BITCOIN';
  static CARD_THANK_YOU_THIS_MUCH = 'THANK_YOU_THIS_MUCH';
  static CARD_HAPPY_BITCOINING = 'HAPPY_BITCOINING';
  static CARD_WELCOME_TO_PINE = 'WELCOME_TO_PINE';
  static CARD_HAPPY_HALLOWEEN = 'HAPPY_HALLOWEEN';

  static CARDS = [
    Card.CARD_DONUT_SPEND_IT_ALL,
    Card.CARD_HAPPY_BIRTHDAY,
    Card.CARD_MOON_AND_BACK,
    Card.CARD_ENJOY_THE_RIDE,
    Card.CARD_PIZZA_OR_FORTUNE,
    Card.CARD_TAKE_MY_BITCOIN,
    Card.CARD_THANK_YOU_THIS_MUCH,
    Card.CARD_HAPPY_BITCOINING,
    Card.CARD_WELCOME_TO_PINE,
    Card.CARD_HAPPY_HALLOWEEN
  ];

  static CARD_IMAGES = {
    [Card.CARD_PLACEHOLDER]: IMAGE_PLACEHOLDER,
    [Card.CARD_DONUT_SPEND_IT_ALL]: IMAGE_DONUT_SPEND_IT_ALL,
    [Card.CARD_HAPPY_BIRTHDAY]: IMAGE_HAPPY_BIRTHDAY,
    [Card.CARD_MOON_AND_BACK]: IMAGE_MOON_AND_BACK,
    [Card.CARD_ENJOY_THE_RIDE]: IMAGE_ENJOY_THE_RIDE,
    [Card.CARD_PIZZA_OR_FORTUNE]: IMAGE_PIZZA_OR_FORTUNE,
    [Card.CARD_TAKE_MY_BITCOIN]: IMAGE_TAKE_MY_BITCOIN,
    [Card.CARD_THANK_YOU_THIS_MUCH]: IMAGE_THANK_YOU_THIS_MUCH,
    [Card.CARD_HAPPY_BITCOINING]: IMAGE_HAPPY_BITCOINING,
    [Card.CARD_WELCOME_TO_PINE]: IMAGE_WELCOME_TO_PINE,
    [Card.CARD_HAPPY_HALLOWEEN]: IMAGE_HAPPY_HALLOWEEN
  };

  static CARD_BLUR_TYPES = {
    [Card.CARD_DONUT_SPEND_IT_ALL]: BLUR_TYPE_LIGHT,
    [Card.CARD_HAPPY_BIRTHDAY]: BLUR_TYPE_LIGHT,
    [Card.CARD_MOON_AND_BACK]: BLUR_TYPE_DARK,
    [Card.CARD_ENJOY_THE_RIDE]: BLUR_TYPE_LIGHT,
    [Card.CARD_PIZZA_OR_FORTUNE]: BLUR_TYPE_LIGHT,
    [Card.CARD_TAKE_MY_BITCOIN]: BLUR_TYPE_LIGHT,
    [Card.CARD_THANK_YOU_THIS_MUCH]: BLUR_TYPE_LIGHT,
    [Card.CARD_HAPPY_BITCOINING]: BLUR_TYPE_LIGHT,
    [Card.CARD_WELCOME_TO_PINE]: BLUR_TYPE_LIGHT,
    [Card.CARD_HAPPY_HALLOWEEN]: BLUR_TYPE_LIGHT
  };

  static CARD_FALLBACK_COLORS = {
    [Card.CARD_DONUT_SPEND_IT_ALL]: '#FDE6AA',
    [Card.CARD_HAPPY_BIRTHDAY]: '#FE6B3B',
    [Card.CARD_MOON_AND_BACK]: '#1A222E',
    [Card.CARD_ENJOY_THE_RIDE]: '#80E2D2',
    [Card.CARD_PIZZA_OR_FORTUNE]: '#8090B2',
    [Card.CARD_TAKE_MY_BITCOIN]: '#E96759',
    [Card.CARD_THANK_YOU_THIS_MUCH]: '#F0AE9D',
    [Card.CARD_HAPPY_BITCOINING]: '#0C5670',
    [Card.CARD_WELCOME_TO_PINE]: '#FCEC98',
    [Card.CARD_HAPPY_HALLOWEEN]: '#696399'
  };

  static getImage = card => {
    return Card.CARD_IMAGES[card] || IMAGE_NOT_FOUND;
  };

  static getBlurType = card => {
    return Card.CARD_BLUR_TYPES[card] || BLUR_TYPE_LIGHT;
  };

  static getFallbackColor = card => {
    return Card.CARD_FALLBACK_COLORS[card] || '#F0F0F0';
  };

  state = {
    error: false
  };

  constructor() {
    super(...arguments);
    this._onError = this._onError.bind(this);
  }

  _onError() {
    this.setState({ error: true });
  }

  _getSizeStyle() {
    const { size } = this.props;

    return {
      width: size,
      height: size
    };
  }

  _renderPlaceholder() {
    const { style } = this.props;
    const sizeStyle = this._getSizeStyle();
    const placeholderImage = Card.getImage(Card.CARD_PLACEHOLDER);

    return (
      <View style={[styles.container, sizeStyle, style]}>
        <Image source={placeholderImage} style={[styles.card, sizeStyle]} />
      </View>
    );
  }

  render() {
    const { card, style } = this.props;
    const { error } = this.state;
    const sizeStyle = this._getSizeStyle();
    const cardImage = Card.getImage(card);

    if (error) {
      return this._renderPlaceholder();
    }

    return (
      <View style={[styles.container, sizeStyle, style]}>
        <Image
          source={cardImage}
          style={[styles.card, sizeStyle]}
          onError={this._onError}
        />
      </View>
    );
  }
}

Card.propTypes = {
  card: PropTypes.oneOf(Card.CARDS).isRequired,
  style: PropTypes.any,
  size: PropTypes.number
};

Card.defaultProps = {
  size: 300
};
