import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import DateSectionList from '../DateSectionList';
import Message from './Message';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 16
  }
});

export default class Messages extends PureComponent {
  _keyExtractor(item, index) {
    return item.id || index;
  }

  _renderMessage({ item }) {
    return <Message message={item} />;
  }

  render() {
    const reversedMessages = [...this.props.messages].reverse();

    return (
      <DateSectionList
        style={styles.view}
        inverted={true}
        data={reversedMessages}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderMessage}
      />
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array
};
