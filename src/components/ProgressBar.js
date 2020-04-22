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
    const { progress, animationDuration } = this.props;

    if (progress !== prevProps.progress) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(animationDuration, 'easeInEaseOut', 'opacity')
      );

      this.setState({ progress });
    }
  }

  render() {
    const { theme, style, destructive } = this.props;
    const { progress } = this.state;
    const width = `${Math.min(progress * 100, 100)}%`;

    const backgroundColor = theme.progressBarBackgroundColor;
    const foregroundColor = destructive ? theme.progressBarForegroundColorRed : theme.progressBarForegroundColor;

    return (
      <View style={[styles.bar, { backgroundColor }, style]}>
        <View style={[styles.progress, { backgroundColor: foregroundColor, width }]} />
      </View>
    );
  }
}

ProgressBar.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any,
  progress: PropTypes.number,
  destructive: PropTypes.bool,
  animationDuration: PropTypes.number
};

ProgressBar.defaultProps = {
  progress: 0,
  destructive: false,
  animationDuration: 300
};

export default withTheme(ProgressBar);
