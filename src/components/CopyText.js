import React, { Component } from 'react';
import { Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import ToolTip from 'react-native-tooltip';

export default class CopyText extends Component {
  constructor() {
    super(...arguments);
    this._onCopy = this._onCopy.bind(this);
  }

  _onCopy() {
    const { copyText } = this.props;
    Clipboard.setString(copyText);
  }

  render() {
    const underlayColor = this.props.underlayColor || 'white';

    return (
      <ToolTip
        actions={[
          { text: 'Copy', onPress: this._onCopy }
        ]}
        underlayColor={underlayColor}
        activeOpacity={1}
        arrowDirection={this.props.tooltipArrowDirection}
      >
        {this.props.children}
      </ToolTip>
    );
  }
}

CopyText.propTypes = {
  children: PropTypes.node,
  copyText: PropTypes.string,
  underlayColor: PropTypes.string,
  tooltipArrowDirection: PropTypes.string
};
