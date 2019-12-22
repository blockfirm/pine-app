import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
import Legend from './Legend';

const styles = StyleSheet.create({
  chart: {
    height: 20,
    borderRadius: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 13
  },
  stack: {
    borderLeftWidth: StyleSheet.hairlineWidth * 2
  },
  firstStack: {
    borderLeftWidth: 0
  },
  legends: {
    flexDirection: 'row'
  },
  legend: {
    marginRight: 13
  }
});

class StackedBarChart extends PureComponent {
  _renderStacks() {
    const { data, theme } = this.props;
    let isFirst = true;

    const total = data.reduce((sum, item) => {
      return sum + item.value;
    }, 0);

    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;

      if (!percentage) {
        return null;
      }

      const style = [
        styles.stack,
        theme.stackedBarChartStack,
        { backgroundColor: item.color, width: `${percentage}%` },
        isFirst ? styles.firstStack : null
      ];

      isFirst = false;

      return (
        <View key={index} style={style} />
      );
    });
  }

  _renderLegends() {
    const { data } = this.props;

    return data.map((item, index) => (
      <Legend
        key={index}
        color={item.color}
        label={item.label}
        style={styles.legend}
      />
    ));
  }

  render() {
    const { theme } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.chart, theme.stackedBarChart]}>
          { this._renderStacks() }
        </View>
        <View style={styles.legends}>
          { this._renderLegends() }
        </View>
      </View>
    );
  }
}

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.number
  })),
  theme: PropTypes.object.isRequired
};

export default withTheme(StackedBarChart);
