import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import ErrorBoundary from '../components/ErrorBoundary';
import BackHeaderContainer from '../containers/BackHeaderContainer';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  }
});

class BaseScreen extends Component {
  renderHeader() {
    if (this.props.hideHeader) {
      return null;
    }

    return (
      <BackHeaderContainer title={this.props.headerTitle} />
    );
  }

  render() {
    const { theme } = this.props;

    const style = [
      styles.view,
      theme.background,
      this.props.style
    ];

    return (
      <ErrorBoundary {...this.props} style={style}>
        {this.renderHeader()}
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

BaseScreen.propTypes = {
  style: PropTypes.any,
  headerTitle: PropTypes.string,
  hideHeader: PropTypes.bool,
  children: PropTypes.node,
  theme: PropTypes.object
};

export default withTheme(BaseScreen);
