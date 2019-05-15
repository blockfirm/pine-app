import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Legend from './Legend';

const styles = StyleSheet.create({
  chart: {
    height: 20,
    borderRadius: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 13,
    backgroundColor: '#efefef'
  },
  stack: {
    borderLeftWidth: StyleSheet.hairlineWidth * 2,
    borderLeftColor: 'white'
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

export default class StackedBarChart extends PureComponent {
  _renderStacks() {
    const { data } = this.props;
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
    return (
      <View style={styles.container}>
        <View style={styles.chart}>
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
  }))
};
