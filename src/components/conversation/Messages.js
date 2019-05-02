import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import MessageContainer from '../../containers/conversation/MessageContainer';
import DateSectionList from '../DateSectionList';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 16
  }
});

export default class Messages extends PureComponent {
  constructor() {
    super(...arguments);

    this._newMessage = null;
    this._previousLength = null;
    this._renderMessage = this._renderMessage.bind(this);
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
    const isFirst = Boolean(!prevItem || prevItem.from !== item.from);
    const isLast = Boolean(!nextItem || nextItem.from !== item.from);
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

    /**
     * Check if there are more messages in this render
     * and save the latest one so it can be animated.
     */
    if (this._previousLength !== null && messages.length > this._previousLength) {
      this._newMessage = messages[0]; // First message because the list is reversed.
    } else {
      this._newMessage = null;
    }

    this._previousLength = messages.length;

    return (
      <DateSectionList
        style={styles.view}
        inverted={true}
        data={messages}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderMessage}
      />
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array,
  contact: PropTypes.object
};
