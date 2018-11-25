import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../styles/headerStyles';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ContentView from '../components/ContentView';
import StyledText from '../components/StyledText';
import BtcLabel from '../components/BtcLabel';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    justifyContent: 'flex-start'
  }
});

@connect()
export default class ReviewAndPayScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Review and Pay',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
    };
  };

  render() {
    const { address, amountBtc, displayUnit } = this.props.navigation.state.params;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <View>
            <StyledText>To: {address}</StyledText>
          </View>
          <View>
            <StyledText>
              Amount: <BtcLabel amount={amountBtc} unit={displayUnit} />
            </StyledText>
          </View>
        </ContentView>
        <Footer>
          <Button label='Pay' onPress={() => {}} />
        </Footer>
      </BaseScreen>
    );
  }
}

ReviewAndPayScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object
};
