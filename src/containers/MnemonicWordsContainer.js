import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';

import authentication from '../authentication';
import * as recoveryKeyActions from '../actions/recoveryKey';
import MnemonicWords from '../components/MnemonicWords';

const mapStateToProps = (state) => {
  return {
    revealed: state.recoveryKey.visible
  };
};

class MnemonicWordsContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(...arguments);

    const dispatch = props.dispatch;
    dispatch(recoveryKeyActions.hide());
  }

  _onReveal() {
    const dispatch = this.props.dispatch;

    ReactNativeHaptic.generate('selection');

    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        dispatch(recoveryKeyActions.reveal());
      }
    });
  }

  render() {
    return (
      <MnemonicWords
        {...this.props}
        onReveal={this._onReveal.bind(this)}
      />
    );
  }
}

const MnemonicWordsConnector = connect(
  mapStateToProps
)(MnemonicWordsContainer);

export default MnemonicWordsConnector;
