import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const HeaderBackground = function ({ theme }) {
  return (
    <View
      style={[{ flex: 1, alignSelf: 'stretch' }, theme.header]}
    />
  );
};

HeaderBackground.propTypes = {
  theme: PropTypes.object.isRequired
};

export default withTheme(HeaderBackground);
