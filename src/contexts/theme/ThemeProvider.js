import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Appearance, AppearanceProvider } from 'react-native-appearance';

import { getColorTheme } from '../../styles';
import ThemeContext from './ThemeContext';

export default class ThemeProvider extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      themeName: Appearance.getColorScheme()
    };
  }

  componentDidMount() {
    this._appearanceListener = Appearance.addChangeListener(({ colorScheme }) => {
      this.setState({ themeName: colorScheme });
    });
  }

  componentWillUnmount() {
    if (this._appearanceListener) {
      this._appearanceListener.remove();
    }
  }

  render() {
    const theme = getColorTheme(this.state.themeName);

    return (
      <AppearanceProvider>
        <ThemeContext.Provider value={theme}>
          {this.props.children}
        </ThemeContext.Provider>
      </AppearanceProvider>
    );
  }
}

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired
};
