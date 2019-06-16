import React, { Component } from 'react';
import { SectionList } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DateSectionHeader from './DateSectionHeader';

const defaultTimestampExtractor = (item) => {
  return item.createdAt;
};

export default class DateSectionList extends Component {
  // eslint-disable-next-line max-statements
  _getSectionTitle(item) {
    const { timestampExtractor } = this.props;
    const timestamp = timestampExtractor(item);
    const date = moment(new Date(timestamp * 1000));
    const now = moment();
    const yesterday = moment().subtract(1, 'days');
    const lastWeek = moment().subtract(1, 'weeks');

    if (date.isSame(now, 'day')) {
      return 'Today';
    }

    if (date.isSame(yesterday, 'day')) {
      return 'Yesterday';
    }

    if (date.isSame(now, 'week')) {
      return moment.weekdays(date.weekday());
    }

    if (date.isSame(lastWeek, 'week')) {
      return 'Last Week';
    }

    if (date.isSame(now, 'year')) {
      return date.format('MMMM');
    }

    return date.format('MMMM, YYYY');
  }

  _getSections(items) {
    const sections = {};

    items.forEach((item) => {
      const title = this._getSectionTitle(item);

      if (!sections[title]) {
        sections[title] = [];
      }

      sections[title].push(item);
    });

    return Object.keys(sections).map((title) => ({
      title,
      data: sections[title]
    }));
  }

  scrollToTop() {
    if (this._list) {
      this._list.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0
      });
    }
  }

  render() {
    const { data, inverted } = this.props;
    const sections = this._getSections(data);
    const renderSectionHeaderPropName = inverted ? 'renderSectionFooter' : 'renderSectionHeader';

    const renderSectionHeaderProps = {
      [renderSectionHeaderPropName]: ({ section: { title } }) => (
        <DateSectionHeader title={title} />
      )
    };

    return (
      <SectionList
        {...this.props}
        {...renderSectionHeaderProps}
        ref={(ref) => { this._list = ref; }}
        sections={sections}
      />
    );
  }
}

DateSectionList.propTypes = {
  data: PropTypes.array.isRequired,
  inverted: PropTypes.bool,
  timestampExtractor: PropTypes.func
};

DateSectionList.defaultProps = {
  timestampExtractor: defaultTimestampExtractor
};
