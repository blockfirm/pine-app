import React from 'react';
import renderer from 'react-test-renderer';
import FiatLabel from '../../../src/components/FiatLabel';

describe('FiatLabel', () => {
  describe('when currency is USD', () => {
    it('renders 0 USD correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={0} currency='USD' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2 USD correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2} currency='USD' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.00 USD correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2.00} currency='USD' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.30 USD correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2.30} currency='USD' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 4000 USD correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={4000} currency='USD' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when currency is SEK', () => {
    it('renders 0 SEK correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={0} currency='SEK' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2 SEK correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2} currency='SEK' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.00 SEK correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2.00} currency='SEK' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 2.30 SEK correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={2.30} currency='SEK' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders 4000 SEK correctly', () => {
      const tree = renderer.create(
        <FiatLabel amount={4000} currency='SEK' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
