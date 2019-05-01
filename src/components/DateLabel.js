import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { formatTime } from '../localization';
import StyledText from './StyledText';

export default class DateLabel extends Component {
  _getDateString(date) {
    const formattedTime = formatTime(date);
    const formattedDate = moment(date).format('DD MMM YYYY');

    return `${formattedDate} ${formattedTime}`;
  }

  render() {
    const { date } = this.props;
    const dateString = this._getDateString(date);

    return (
      <StyledText style={this.props.style}>
        {dateString}
      </StyledText>
    );
  }
}

DateLabel.propTypes = {
  style: PropTypes.any,
  date: PropTypes.instanceOf(Date)
};
