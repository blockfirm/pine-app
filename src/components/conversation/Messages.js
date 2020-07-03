import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import MessageContainer from '../../containers/conversation/MessageContainer';
import DateSectionList from '../DateSectionList';
import CardMessage from './CardMessage';

const MESSAGE_HEIGHT = 73;
const CARD_MESSAGE_HEIGHT = CardMessage.getHeight();

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 16
  }
});

const messageIsCard = (message) => {
  return Boolean(message && message.data && message.data.card);
};

export default class Messages extends PureComponent {
  constructor() {
    super(...arguments);

    this._newMessage = null;
    this._renderMessage = this._renderMessage.bind(this);
  }

  /**
   * Checks if more messages have been added since last time
   * and if so, saves the latest one so it can be animated.
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(nextProps) {
    if (!this._list) {
      return;
    }

    if (!this.props.messages || !this.props.messages.length) {
      return;
    }

    if (nextProps.messages && nextProps.messages.length > this.props.messages.length) {
      this._newMessage = nextProps.messages[nextProps.messages.length - 1];
    } else {
      this._newMessage = null;
      return;
    }

    /**
     * Scroll to the position of the previous message without
     * animating the scroll. This will hide the new message.
     */
    this._list.scrollToLocation({
      itemIndex: 1,
      sectionIndex: 0,
      viewOffset: -this._getNewMessageHeight(),
      viewPosition: 0,
      animated: false
    });

    /**
     * Scroll to the bottom with an animation to reveal the
     * new message in a smooth way. The message itself is
     * also animated to make the effect even better.
     */
    this._list.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      animated: true
    });
  }

  _getNewMessageHeight() {
    if (!this._newMessage) {
      return 0;
    }

    const isCard = messageIsCard(this._newMessage);
    return isCard ? CARD_MESSAGE_HEIGHT : MESSAGE_HEIGHT;
  }

  _keyExtractor(item, index) {
    return item.id || index;
  }

  _shouldAnimateMessage(message) {
    return message === this._newMessage;
  }

  _renderMessage({ item, index, section }) {
    const prevItem = section.data[index + 1]; // Plus one because the list is reversed.
    const nextItem = section.data[index - 1]; // Minus one because the list is reversed.
    const prevItemIsCard = messageIsCard(prevItem);
    const nextItemIsCard = messageIsCard(nextItem);
    const currentItemIsCard = messageIsCard(item);
    const isFirst = Boolean(!prevItem || prevItem.from !== item.from || prevItemIsCard);
    const isLast = Boolean(!nextItem || nextItem.from !== item.from || nextItemIsCard || currentItemIsCard);
    const animate = this._shouldAnimateMessage(item);

    return (
      <MessageContainer
        message={item}
        contact={this.props.contact}
        isFirst={isFirst}
        isLast={isLast}
        animate={animate}
      />
    );
  }

  render() {
    const messages = [...this.props.messages];

    messages.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return (
      <DateSectionList
        ref={(ref) => { this._list = ref; }}
        style={styles.view}
        inverted={true}
        data={messages}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderMessage}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={7}
        onScrollBeginDrag={this.props.onScrollBeginDrag}
      />
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array,
  contact: PropTypes.object,
  onScrollBeginDrag: PropTypes.func
};
