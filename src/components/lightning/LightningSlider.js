import React, { Component } from 'react';
import { PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path, Circle, G } from 'react-native-svg';
import ReactNativeHaptic from 'react-native-haptic';
import { withTheme } from '../../contexts/theme';

const VIEWBOX_SIZE = 348;

class LightningSlider extends Component {
  constructor(props) {
    const { value } = props;

    super(props);

    this.handlePanResponderMove = this.handlePanResponderMove.bind(this);
    this.cartesianToPolar = this.cartesianToPolar.bind(this);
    this.polarToCartesian = this.polarToCartesian.bind(this);

    this.state = {
      cx: VIEWBOX_SIZE / 2,
      cy: VIEWBOX_SIZE / 2,
      r: (VIEWBOX_SIZE / 2) * 0.85,
      meterValue: this.valueToPolar(value)
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove
    });
  }

  polarToCartesian(angle) {
    const { cx, cy, r } = this.state;
    const a = (angle - 270) * Math.PI / 180.0;
    const x = cx + (r * Math.cos(a));
    const y = cy + (r * Math.sin(a));

    return { x, y };
  }

  cartesianToPolar(x, y) {
    const { cx, cy } = this.state;
    return Math.round((Math.atan((y - cy) / (x - cx))) / (Math.PI / 180) + ((x > cx) ? 270 : 90));
  }

  polarToValue(polar) {
    const { maximumValue } = this.props;
    return maximumValue / 341 * polar;
  }

  valueToPolar(value) {
    const { maximumValue } = this.props;
    return Math.round(341 / maximumValue * value);
  }

  handlePanResponderMove({ nativeEvent: { locationX, locationY } }) {
    const { maximumValue, lowerLimit, upperLimit, step, width } = this.props;
    const scale = VIEWBOX_SIZE / width;
    const x = locationX * scale;
    const y = locationY * scale;
    const minPolar = this.valueToPolar(lowerLimit);
    const maxPolar = Math.min(this.valueToPolar(upperLimit), 341);
    const polar = Math.max(Math.min(this.cartesianToPolar(x, y), maxPolar), minPolar);

    const value = this.polarToValue(polar);
    let stepAdjustedValue = Math.round(value / step) * step;

    if (stepAdjustedValue > maximumValue) {
      stepAdjustedValue = maximumValue;
    }

    if (stepAdjustedValue !== this.props.value) {
      ReactNativeHaptic.generate('selection');
      this.props.onValueChange(stepAdjustedValue);
    }

    this.setState({ meterValue: polar });
  }

  render() {
    const { theme, width, height } = this.props;
    const { cx, cy, r, meterValue } = this.state;
    const startCoord = this.polarToCartesian(0);
    const endCoord = this.polarToCartesian(meterValue);

    return (
      <Svg onLayout={this.onLayout} width={width} height={height} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
        <Circle cx={cx} cy={cy} r={r} stroke={theme.sliderBackgroundColor} strokeWidth={50} fill='none' />
        <Path
          stroke={theme.sliderColor}
          strokeWidth={40}
          strokeLinecap='round'
          fill='none'
          d={`M${startCoord.x} ${startCoord.y} A ${r} ${r} 0 ${meterValue > 180 ? 1 : 0} 1 ${endCoord.x} ${endCoord.y}`}
        />
        <G x={endCoord.x - 20} y={endCoord.y - 20}>
          <G stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinejoin='round' x={13} y={11} pointerEvents='none'>
            <G
              fill={theme.sliderIconColor}
              stroke={theme.sliderIconColor}
              strokeWidth='1.62624'
              transform='translate(-350.000000, -1535.000000)'
            >
              <Path d='M351.08044,1544.66942 L357.0461,1536.18765 C357.069167,1536.15485 357.114453,1536.14697 357.147249,1536.17003 C357.166579,1536.18363 357.178082,1536.20578 357.178082,1536.22942 L357.178082,1542.21622 L357.178082,1542.21622 L361.860177,1542.21622 C361.900273,1542.21622 361.932777,1542.24872 361.932777,1542.28882 C361.932777,1542.30377 361.928161,1542.31835 361.91956,1542.33058 L355.9539,1550.81235 C355.930833,1550.84515 355.885547,1550.85303 355.852751,1550.82997 C355.833421,1550.81637 355.821918,1550.79422 355.821918,1550.77058 L355.821918,1544.78378 L355.821918,1544.78378 L351.139823,1544.78378 C351.099727,1544.78378 351.067223,1544.75128 351.067223,1544.71118 C351.067223,1544.69623 351.071839,1544.68165 351.08044,1544.66942 Z' />
            </G>
          </G>

          <Circle cx={20} cy={20} r={30} fill='#000000' opacity='0.0' {...this._panResponder.panHandlers} />
        </G>
      </Svg>
    );
  }
}

LightningSlider.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  lowerLimit: PropTypes.number.isRequired,
  upperLimit: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  theme: PropTypes.object
};

LightningSlider.defaultProps = {
  step: 1
};

export default withTheme(LightningSlider);
