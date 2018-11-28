import React from 'react';
import renderer from 'react-test-renderer';
import UnitLabel from '../../../src/components/UnitLabel';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

describe('UnitLabel', () => {
  it('renders BTC correctly', () => {
    const tree = renderer.create(
      <UnitLabel unit={UNIT_BTC} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders mBTC correctly', () => {
    const tree = renderer.create(
      <UnitLabel unit={UNIT_MBTC} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Satoshis correctly', () => {
    const tree = renderer.create(
      <UnitLabel unit={UNIT_SATOSHIS} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('when unit is undefined', () => {
    it('renders without errors', () => {
      const tree = renderer.create(
        <UnitLabel />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
