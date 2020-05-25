import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import Button from './Button';

const styles = StyleSheet.create({
  wrapper: {
    width: null,
    height: null,
    padding: 15,
    borderRadius: 0,
    backgroundColor: null
  },
  label: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16
  },
  disabledStyle: {
    backgroundColor: null
  }
});

class Link extends Component {
  render() {
    const { theme } = this.props;

    return (
      <Button
        {...this.props}
        label={this.props.children}
        style={[styles.wrapper, this.props.style]}
        labelStyle={[styles.label, theme.link, this.props.labelStyle]}
        disabledStyle={[styles.disabledStyle, this.props.disabledStyle]}
      />
    );
  }
}

Link.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  disabledStyle: PropTypes.any,
  loaderColor: PropTypes.string,
  theme: PropTypes.object
};

Link.defaultProps = {
  loaderColor: 'gray'
};

export default withTheme(Link);
