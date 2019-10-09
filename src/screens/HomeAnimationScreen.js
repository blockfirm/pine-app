import React, { PureComponent } from 'react';
import { Animated, Easing, View, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import MaskedView from '@react-native-community/masked-view';
import HomeScreen from './HomeScreen';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const CIRCLE_DIAMETER_START = 10;
const CIRCLE_DIAMETER_END = Math.max(WINDOW_HEIGHT, WINDOW_WIDTH) * 1.12;
const CIRCLE_MAX_SCALE = CIRCLE_DIAMETER_END / CIRCLE_DIAMETER_START;

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  maskElement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  yellowLayer: {
    backgroundColor: '#FFD200',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteLayer: {
    backgroundColor: 'white'
  },
  logo: {
    width: 128,
    height: 57
  },
  circle: {
    width: CIRCLE_DIAMETER_START,
    height: CIRCLE_DIAMETER_START,
    borderRadius: 5,
    backgroundColor: 'white'
  }
});

@connect()
export default class HomeAnimationScreen extends PureComponent {
  static navigationOptions = {
    header: null
  }

  state = {
    logoAnim: new Animated.Value(0),
    overlayAnim: new Animated.Value(0),
    appAnim: new Animated.Value(0),
    animationDone: false
  }

  componentDidMount() {
    this._startAnimation();
  }

  _startAnimation() {
    const { logoAnim, overlayAnim, appAnim } = this.state;

    const loadingAnimation = Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 500,
        duration: 350,
        easing: Easing.easeOutQuint,
        useNativeDriver: true
      }),
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1000,
          duration: 100,
          easing: Easing.easeOutQuart,
          useNativeDriver: true
        }),,
        Animated.timing(overlayAnim, {
          toValue: 1000,
          duration: 300,
          easing: Easing.easeInCirc,
          useNativeDriver: true
        }),
        Animated.timing(appAnim, {
          toValue: 1000,
          duration: 350,
          easing: Easing.easeOutCirc,
          useNativeDriver: true
       })
     ])
    ]);

    loadingAnimation.start(() => {
      this.setState({ animationDone: true });
    });
  }

  _renderYellowLayer() {
    if (this.state.animationDone) {
      return null;
    }

    return (
      <View style={[StyleSheet.absoluteFill, styles.yellowLayer]}>
        {this._renderLogo()}
      </View>
    );
  }

  _renderWhiteLayer() {
    if (this.state.animationDone) {
      return null;
    }

    return <View style={[StyleSheet.absoluteFill, styles.whiteLayer]} />;
  }

  _renderMaskElement() {
    const { overlayAnim } = this.state;

    const circleScale = {
      opacity: overlayAnim.interpolate({
        inputRange: [0, 200, 250],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      }),
      transform: [{
        scale: overlayAnim.interpolate({
          inputRange: [0, 100, 900],
          outputRange: [1, 1, CIRCLE_MAX_SCALE]
        })
      }]
    };

    return (
      <View style={styles.maskElement}>
        <Animated.View style={[styles.circle, circleScale]} />
      </View>
    );
  }

  _renderLogo() {
    const { logoAnim } = this.state;

    const logoScale = {
      transform: [{
        scale: logoAnim.interpolate({
          inputRange: [0, 500, 1000],
          outputRange: [1, 0.8, 1]
        })
      }]
    };

    return (
      <Animated.Image
        source={{ uri: 'LaunchScreenLogo' }}
        style={[styles.logo, logoScale]}
      />
    );
  }

  render() {
    const { overlayAnim, appAnim } = this.state;

    const opacityClearToVisible = {
      opacity: overlayAnim.interpolate({
        inputRange: [0, 200, 500],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })
    };

    const appScale = {
      transform: [{
        scale: appAnim.interpolate({
          inputRange: [0, 200, 1000],
          outputRange: [1.04, 1.03, 1]
        })
      }]
    };

    return (
      <View style={styles.fullscreen}>
        {this._renderYellowLayer()}

        <MaskedView
          style={styles.fullscreen}
          maskElement={this._renderMaskElement()}
        >
          {this._renderWhiteLayer()}

          <Animated.View style={[styles.fullscreen, opacityClearToVisible, appScale]}>
            <HomeScreen {...this.props} />
          </Animated.View>
        </MaskedView>
      </View>
    );
  }
}
