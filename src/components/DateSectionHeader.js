import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const SECTION_HEADER_HEIGHT = 26;
const SECTION_HEADER_MARGIN_TOP = 30;
const SECTION_HEADER_MARGIN_BOTTOM = 12;

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#F6F6F6',
    marginTop: SECTION_HEADER_MARGIN_TOP,
    marginBottom: SECTION_HEADER_MARGIN_BOTTOM,
    padding: 6,
    paddingHorizontal: 12,
    height: SECTION_HEADER_HEIGHT,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SECTION_HEADER_HEIGHT / 2
  },
  sectionHeaderText: {
    color: '#8A8A8F',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.07
  }
});

export default class DateSectionHeader extends Component {
  render() {
    const { title } = this.props;

    return (
      <View style={styles.sectionHeader}>
        <StyledText style={styles.sectionHeaderText}>{title}</StyledText>
      </View>
    );
  }
}

DateSectionHeader.propTypes = {
  title: PropTypes.string.isRequired
};
