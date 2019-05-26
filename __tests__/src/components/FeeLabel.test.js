import React from 'react';
import renderer from 'react-test-renderer';
import FeeLabel from '../../../src/components/FeeLabel';

jest.mock('../../../src/containers/CurrencyLabelContainer', () => 'CurrencyLabelContainer');

describe('FeeLabel', () => {
  it('renders low fees correctly', () => {
    const tree = renderer.create(
      <FeeLabel amount={1} fee={0.001} unit='BTC' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders medium fees correctly', () => {
    const tree = renderer.create(
      <FeeLabel amount={2} fee={0.12} unit='BTC' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders high fees correctly', () => {
    const tree = renderer.create(
      <FeeLabel amount={0.5} fee={0.15} unit='BTC' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
