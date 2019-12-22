import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchBar from 'react-native-search-bar';

import { save as saveSettings } from '../../actions/settings';
import { get as getFiatRates } from '../../actions/bitcoin/fiatRates';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsOption from '../../components/SettingsOption';
import BaseSettingsScreen from './BaseSettingsScreen';
import { FIAT_CURRENCIES } from '../../localization';
import config from '../../config';

const TITLES = {
  'primary': 'Primary Currency',
  'secondary': 'Secondary Currency'
};

const styles = StyleSheet.create({
  view: {
    paddingTop: 0
  }
});

@connect((state) => ({
  settings: state.settings
}))
export default class SelectCurrencyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title={TITLES[navigation.state.params.type]} />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  constructor(props) {
    super(...arguments);

    const { type } = props.navigation.state.params;

    this.state = {
      currency: props.settings.currency[type],
      searchTerm: null
    };
  }

  componentWillUnmount() {
    const dispatch = this.props.dispatch;

    this._save();
    dispatch(getFiatRates());
  }

  _save() {
    const dispatch = this.props.dispatch;
    const { type } = this.props.navigation.state.params;
    const currency = this.state.currency || config.currency['type'];

    dispatch(saveSettings({
      currency: {
        [type]: currency
      }
    }));
  }

  _onSelect(currency) {
    this.setState({ currency });
  }

  _onSearch(term) {
    this.setState({ searchTerm: term });
  }

  _renderOptions() {
    let searchTerm = this.state.searchTerm || '';
    let visibleCurrencies = FIAT_CURRENCIES;

    searchTerm = searchTerm.toLowerCase().trim();

    if (searchTerm) {
      visibleCurrencies = visibleCurrencies.filter((currency) => {
        return currency.toLowerCase().trim().indexOf(searchTerm) === 0;
      });
    }

    return visibleCurrencies.map((currency, index) => {
      return (
        <SettingsOption
          key={currency}
          name={currency}
          value={this.state.currency}
          onSelect={this._onSelect.bind(this)}
          isLastItem={index === visibleCurrencies.length - 1}
        />
      );
    });
  }

  render() {
    return (
      <BaseSettingsScreen wrapperStyle={styles.view}>
        <SearchBar
          placeholder='Search'
          onChangeText={this._onSearch.bind(this)}
          showsCancelButtonWhileEditing={false}
        />
        <SettingsGroup>
          {this._renderOptions()}
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SelectCurrencyScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
