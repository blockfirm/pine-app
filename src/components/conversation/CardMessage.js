import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { VibrancyView } from '@react-native-community/blur';

import { satsToBtc } from '../../crypto/bitcoin/convert';
import { withTheme } from '../../contexts/theme';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import Bullet from '../typography/Bullet';
import MessageIndicator from '../indicators/MessageIndicator';
import Card from './Card';

const WINDOW_WIDTH = Dimensions.get('window').width;
const CARD_SIZE = Math.floor(WINDOW_WIDTH * 0.8);
const BORDER_RADIUS = Math.floor(CARD_SIZE * 0.07);
const FOOTER_HEIGHT = 33;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden'
  },
  card: {
    borderRadius: BORDER_RADIUS
  },
  cardText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.85
  },
  footer: {
    zIndex: -1,
    height: FOOTER_HEIGHT + BORDER_RADIUS,
    marginTop: -BORDER_RADIUS,
    paddingTop: BORDER_RADIUS,
    overflow: 'hidden'
  },
  vibrancyViewWrapper: {
    position: 'absolute',
    marginTop: -(CARD_SIZE - FOOTER_HEIGHT - BORDER_RADIUS - 10)
  },
  vibrancyView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  amountWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  bullet: {
    marginHorizontal: 7,
    opacity: 0.5
  },
  status: {
    marginRight: 6
  },
  nonErrorIndicator: {
    opacity: 0.75
  }
});

class CardMessage extends PureComponent {
  static getHeight = () => CARD_SIZE + FOOTER_HEIGHT;

  _getCard() {
    const { message } = this.props;
    return message.data.card;
  }

  _getAmountBtc() {
    const { message, invoice } = this.props;
    const amountBtc = invoice ? satsToBtc(invoice.paidAmount) : message.amountBtc;

    return amountBtc;
  }

  _getTextColor() {
    const { hasError } = this.props;
    const card = this._getCard();
    const blurType = Card.getBlurType(card);
    const textColor = blurType === 'dark' ? 'white' : 'black';

    if (hasError) {
      return 'white';
    }

    return textColor;
  }

  _renderVibrancyView() {
    const { hasError } = this.props;
    const card = this._getCard();
    const blurType = Card.getBlurType(card);
    const fallbackColor = Card.getFallbackColor(card);

    if (hasError) {
      return null;
    }

    return (
      <View style={styles.vibrancyViewWrapper}>
        <Card card={card} size={CARD_SIZE} style={styles.card} />
        <VibrancyView
          blurType={blurType}
          blurAmount={8}
          style={[styles.vibrancyView]}
          reducedTransparencyFallbackColor={fallbackColor}
        />
      </View>
    );
  }

  _renderStatus() {
    const { message, transaction, invoice, hasError } = this.props;
    const textColor = this._getTextColor();
    const style = !hasError && styles.nonErrorIndicator;

    return (
      <View style={styles.status}>
        <MessageIndicator
          message={message}
          transaction={transaction}
          invoice={invoice}
          colorStyle={textColor}
          style={style}
        />
      </View>
    );
  }

  render() {
    const { hasError, textStyle, onPress, theme } = this.props;
    const card = this._getCard();
    const amountBtc = this._getAmountBtc();
    const textColor = this._getTextColor();

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        <Animated.View style={styles.cardWrapper}>
          <Card card={card} size={CARD_SIZE} style={styles.card} />
          <View style={[styles.footer, hasError && theme.bubbleError]}>
            { this._renderVibrancyView() }
            <View style={styles.amountWrapper}>
              { this._renderStatus() }
              <CurrencyLabelContainer
                amountBtc={amountBtc}
                currencyType='primary'
                style={[textStyle, styles.cardText, { color: textColor }]}
              />
              <Bullet style={[styles.bullet, { backgroundColor: textColor }]} />
              <CurrencyLabelContainer
                amountBtc={amountBtc}
                currencyType='secondary'
                style={[textStyle, styles.cardText, { color: textColor }]}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

CardMessage.propTypes = {
  theme: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  transaction: PropTypes.object,
  invoice: PropTypes.object,
  hasError: PropTypes.bool,
  textStyle: PropTypes.any,
  onPress: PropTypes.func
};

CardMessage.defaultProps = {
  hasError: false
};

export default withTheme(CardMessage);
