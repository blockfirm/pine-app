import React from 'react';
import { Appearance } from 'react-native-appearance';
import { getColorTheme } from '../../styles';

const ThemeContext = React.createContext(
  getColorTheme(Appearance.getColorScheme())
);

export default ThemeContext;
