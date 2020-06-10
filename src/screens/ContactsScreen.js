import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import config from '../config';
import OfflineNoticeContainer from '../containers/OfflineNoticeContainer';
import ContactListContainer from '../containers/ContactListContainer';
import ContactsScreenHeader from '../components/ContactsScreenHeader';
import { withTheme } from '../contexts/theme';
import BaseScreen from './BaseScreen';

const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  bottomGradient: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    width: WINDOW_WIDTH,
    height: 150 + ifIphoneX(24, 0)
  }
});

@connect(null, null, null, { withRef: true })
class ContactsScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _addContact() {
    const { dispatch } = this.props;

    dispatch(
      NavigationActions.navigate({ routeName: 'AddContact' })
    );
  }

  _showSettings() {
    const { dispatch } = this.props;

    dispatch(
      NavigationActions.navigate({ routeName: 'Settings' })
    );
  }

  _showWalletBalance() {
    const { navigation } = this.props;
    const routeName = config.lightning.enabled ? 'WalletBalance' : 'OnChainBalanceModal';
    const isModal = true;

    navigation.navigate(routeName, { isModal });
  }

  scrollToTop() {
    if (this._contactList) {
      this._contactList.scrollToTop();
    }
  }

  render() {
    const { theme } = this.props;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContactsScreenHeader
          onAddContactPress={this._addContact.bind(this)}
          onSettingsPress={this._showSettings.bind(this)}
          onBalancePress={this._showWalletBalance.bind(this)}
        />

        <OfflineNoticeContainer />
        <ContactListContainer ref={ref => { this._contactList = ref && ref.getWrappedInstance(); }} />

        <View style={styles.bottomGradient} pointerEvents='none'>
          <LinearGradient
            colors={theme.homeGradientColors}
            locations={[0.1, 0.7]}
            style={styles.bottomGradient}
          />
        </View>
      </BaseScreen>
    );
  }
}

ContactsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(ContactsScreen);
