import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment-timezone';
import RelativeDateLabel from '../../../src/components/RelativeDateLabel';

const realUtcOffset = moment().utcOffset();

describe('RelativeDateLabel', () => {
  let dateNowSpy;

  beforeAll(() => {
    moment().utcOffset(120);

    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date('29 November, 2018, 21:59 GMT+02:00').getTime();
    });
  });

  afterAll(() => {
    moment().utcOffset(realUtcOffset);
    dateNowSpy.mockRestore();
  });

  it('renders correctly when date is now', () => {
    const now = new Date(Date.now());

    const tree = renderer.create(
      <RelativeDateLabel date={now} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 2 hours ago but still the same day', () => {
    const twoHoursAgo = moment().subtract(2, 'hours');

    const tree = renderer.create(
      <RelativeDateLabel date={twoHoursAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was yesterday', () => {
    const yesterday = moment().subtract(1, 'days');

    const tree = renderer.create(
      <RelativeDateLabel date={yesterday.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 2 days ago but still the same week', () => {
    const twoDaysAgo = moment().subtract(2, 'days');

    const tree = renderer.create(
      <RelativeDateLabel date={twoDaysAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 1 week ago', () => {
    const oneWeekAgo = moment().subtract(1, 'weeks');

    const tree = renderer.create(
      <RelativeDateLabel date={oneWeekAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 2 weeks ago but still the same month', () => {
    const twoWeekAgo = moment().subtract(2, 'weeks');

    const tree = renderer.create(
      <RelativeDateLabel date={twoWeekAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 1 month ago but still the same year', () => {
    const oneMonthAgo = moment().subtract(1, 'months');

    const tree = renderer.create(
      <RelativeDateLabel date={oneMonthAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when date was 1 year ago', () => {
    const oneYearAgo = moment().subtract(1, 'years');

    const tree = renderer.create(
      <RelativeDateLabel date={oneYearAgo.toDate()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
