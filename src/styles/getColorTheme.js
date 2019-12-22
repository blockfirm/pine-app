import themes from './themes';

const getColorTheme = (colorTheme) => {
  const theme = themes[colorTheme] || themes.default;
  theme.name = colorTheme;
  return theme;
};

export default getColorTheme;
