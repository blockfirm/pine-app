import React from 'react';
import renderer from 'react-test-renderer';
import BtcLabel from '../../../src/components/BtcLabel';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

describe('BtcLabel', () => {
  describe('when unit is BTC', () => {
    it('renders 0 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={2} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.00 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={2.00} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.30 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={2.30} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00002001 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00002001} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00000002 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00000002} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 4000 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={4000} unit={UNIT_BTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when unit is mBTC', () => {
    it('renders 0 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0} unit={UNIT_MBTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={2} unit={UNIT_MBTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00002001 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00002001} unit={UNIT_MBTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00000002 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00000002} unit={UNIT_MBTC} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when unit is Satoshis', () => {
    it('renders 0 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0} unit={UNIT_SATOSHIS} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={2} unit={UNIT_SATOSHIS} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00002001 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00002001} unit={UNIT_SATOSHIS} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 0.00000002 BTC correctly', () => {
      const tree = renderer.create(
        <BtcLabel amount={0.00000002} unit={UNIT_SATOSHIS} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when unit is undefined', () => {
    it('renders without errors', () => {
      const tree = renderer.create(
        <BtcLabel amount={123} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
