import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import ThemeConsumer from './ThemeConsumer';

export default function withTheme(Component) {
  const ComponentWithTheme = React.forwardRef((props, ref) => (
    <ThemeConsumer>
      {theme => (
        <Component
          {...props}
          ref={ref}
          theme={theme}
        />
      )}
    </ThemeConsumer>
  ));

  ComponentWithTheme.displayName = `withTheme(${Component.displayName || Component.name})`;

  return hoistStatics(ComponentWithTheme, Component);
}
