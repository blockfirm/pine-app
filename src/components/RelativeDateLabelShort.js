import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import StyledText from './StyledText';

const UPDATE_INTERVAL = 60 * 1000; // Every minute.

moment.defineLocale('en-short', {
  parentLocale: 'en',
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'now',
    ss: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy'
  }
});

export default class RelativeDateLabelShort extends Component {
  componentDidMount() {
    // Auto-update component every minute to update the relative time label.
    if (this._shouldForceUpdate()) {
      this._interval = setInterval(this._forceUpdate.bind(this), UPDATE_INTERVAL);
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _forceUpdate() {
    this.forceUpdate();

    if (!this._shouldForceUpdate()) {
      clearInterval(this._interval);
    }
  }

  _shouldForceUpdate() {
    const now = moment();
    const date = moment(this.props.date);
    const differenceInMinutes = now.diff(date, 'minutes');

    // Only auto-update if date was less than 60 minutes ago.
    return Math.abs(differenceInMinutes) < 60;
  }

  _getRelativeDate(date) {
    const withoutSuffix = true;
    const relativeDate = moment(date).locale('en-short').fromNow(withoutSuffix);

    if (relativeDate === 'now') {
      return 'Now';
    }

    return `${relativeDate} ago`;
  }

  _getDateString(date) {
    const momentDate = moment(date);
    const now = moment();
    const yesterday = moment().subtract(1, 'days');
    const lastWeek = moment().subtract(1, 'weeks');

    if (momentDate.isSame(now, 'day')) {
      return this._getRelativeDate(date);
    }

    if (momentDate.isSame(yesterday, 'day')) {
      return this._getRelativeDate(date);
    }

    if (momentDate.isSame(now, 'week')) {
      return this._getRelativeDate(date);
    }

    if (momentDate.isSame(lastWeek, 'week')) {
      return this._getRelativeDate(date);
    }

    if (momentDate.isSame(now, 'year')) {
      return momentDate.format('ddd');
    }

    return momentDate.format('ddd');
  }

  render() {
    const dateString = this._getDateString(this.props.date);

    return (
      <StyledText style={this.props.style} numberOfLines={1}>
        {dateString}
      </StyledText>
    );
  }
}

RelativeDateLabelShort.propTypes = {
  style: PropTypes.any,
  date: PropTypes.object
};
