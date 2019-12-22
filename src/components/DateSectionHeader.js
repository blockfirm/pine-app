import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

export const SECTION_HEADER_HEIGHT = 26;
export const SECTION_HEADER_MARGIN_TOP = 30;
export const SECTION_HEADER_MARGIN_BOTTOM = 20;

const styles = StyleSheet.create({
  sectionHeader: {
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
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.07
  }
});

class DateSectionHeader extends Component {
  render() {
    const { title, theme } = this.props;

    return (
      <View style={[styles.sectionHeader, theme.sectionHeader]}>
        <StyledText style={[styles.sectionHeaderText, theme.sectionHeaderText]}>
          {title}
        </StyledText>
      </View>
    );
  }
}

DateSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.object
};

export default withTheme(DateSectionHeader);
