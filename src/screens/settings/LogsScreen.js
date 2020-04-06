import React, { Component } from 'react';
import { StyleSheet, Share, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import { save as saveSettings } from '../../actions/settings';
import { clear as clearLogs } from '../../actions/logs';
import ShareIcon from '../../components/icons/ShareIcon';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  clearButtonContainer: {
    paddingRight: 0,
    marginLeft: 0
  },
  clearButton: {
    alignSelf: 'center'
  },
  share: {
    position: 'absolute',
    top: 0,
    right: 11.5,
    padding: 9 // The padding makes it easier to press.
  }
});

@connect((state) => ({
  loggingEnabled: state.settings.logging.enabled,
  logEntries: state.logs.entries
}))
class LogsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const onShare = navigation.getParam('onShare');

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title='Logs' />,
      headerLeft: <BackButton onPress={() => navigation.goBack()} />,
      headerRight: (
        <TouchableOpacity onPress={onShare} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(...arguments);

    const visibleEntries = props.logEntries.slice(-100).reverse();
    this.state = { visibleEntries };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onShare: this._onShare.bind(this)
    });
  }

  _onShare() {
    const { logEntries } = this.props;

    Share.share({
      type: 'plain/text',
      subject: 'Pine Log',
      message: JSON.stringify(logEntries, null, 2)
    });
  }

  _clearLogs() {
    const { dispatch } = this.props;

    dispatch(clearLogs());

    this.setState({
      visibleEntries: []
    });
  }

  _onChangeEnabled(enabled) {
    const { dispatch } = this.props;

    dispatch(saveSettings({
      logging: { enabled }
    }));
  }

  _showDetails(entry) {
    const { navigation } = this.props;
    navigation.navigate('LogDetails', { entry });
  }

  _renderLogEntries() {
    const { theme } = this.props;
    const { visibleEntries } = this.state;

    if (!visibleEntries.length) {
      return null;
    }

    const entries = visibleEntries.map((entry, index) => (
      <SettingsLink
        key={index}
        name={entry.title}
        onPress={this._showDetails.bind(this, entry)}
        isLastItem={index === visibleEntries.length - 1}
        labelStyle={/ERROR|FAILURE/.test(entry.title) && theme.errorText}
      />
    ));

    return (
      <>
        <SettingsTitle>Log Entries</SettingsTitle>
        <SettingsGroup>
          {entries}
        </SettingsGroup>
        <SettingsDescription>
          Only the last 100 entries are shown. Share the log to export all entries.
        </SettingsDescription>
      </>
    );
  }

  _renderClearButton() {
    const { visibleEntries } = this.state;

    if (!visibleEntries.length) {
      return null;
    }

    return (
      <SettingsGroup>
        <SettingsButton
          title='Clear'
          type='destructive'
          onPress={this._clearLogs.bind(this)}
          style={styles.clearButton}
          containerStyle={styles.clearButtonContainer}
          isLastItem={true}
        />
      </SettingsGroup>
    );
  }

  render() {
    const { loggingEnabled } = this.props;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute
            name='Enabled'
            value={Boolean(loggingEnabled)}
            onValueChange={this._onChangeEnabled.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Logs are only stored temporarily and are cleared once you restart the app.
          They never leave your device.
        </SettingsDescription>

        {this._renderLogEntries()}
        {this._renderClearButton()}
      </BaseSettingsScreen>
    );
  }
}

LogsScreen.propTypes = {
  theme: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  loggingEnabled: PropTypes.bool,
  logEntries: PropTypes.array
};

export default withTheme(LogsScreen);
