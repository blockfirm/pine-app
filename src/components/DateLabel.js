import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import StyledText from './StyledText';

export default class DateLabel extends Component {
  _getDateString(date) {
    return moment(date).format('DD MMM YYYY HH:mm');
  }

  render() {
    const dateString = this._getDateString(this.props.date);

    return (
      <StyledText style={this.props.style}>
        {dateString}
      </StyledText>
    );
  }
}

DateLabel.propTypes = {
  style: PropTypes.any,
  date: PropTypes.object
};
