import React, { PureComponent } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  bar: {
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  progress: {
    height: 5
  }
});

class ProgressBar extends PureComponent {
  constructor(props) {
    super(...arguments);

    this.state = {
      progress: props.progress
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.progress !== prevProps.progress) {
      LayoutAnimation.easeInEaseOut();

      this.setState({
        progress: this.props.progress
      });
    }
  }

  render() {
    const { theme, style } = this.props;
    const { progress } = this.state;
    const width = `${Math.min(progress * 100, 100)}%`;

    return (
      <View style={[
        styles.bar,
        { backgroundColor: theme.progressBarBackgroundColor },
        style
      ]}>
        <View style={[
          styles.progress,
          { backgroundColor: theme.progressBarForegroundColor },
          { width }
        ]} />
      </View>
    );
  }
}

ProgressBar.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any,
  progress: PropTypes.number
};

ProgressBar.defaultProps = {
  progress: 0
};

export default withTheme(ProgressBar);
