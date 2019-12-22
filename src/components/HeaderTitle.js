import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  }
});

class HeaderTitle extends Component {
  render() {
    const { title, theme } = this.props;

    return (
      <View>
        <StyledText style={[headerStyles.title, theme.headerTitle, styles.title]}>
          {title}
        </StyledText>
      </View>
    );
  }
}

HeaderTitle.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default withTheme(HeaderTitle);
