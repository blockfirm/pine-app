import React from 'react';
import renderer from 'react-test-renderer';
import SettingsButton from '../../../src/components/SettingsButton';

describe('SettingsButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsButton
        title='dbf83264-0385-43a8-9cbb-ff52c1587401'
        onPress={() => {}}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as the last item', () => {
    const tree = renderer.create(
      <SettingsButton
        title='8923b772-b0b3-4cb9-9ec1-f08516a80dd5'
        onPress={() => {}}
        isLastItem={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly while loading', () => {
    const tree = renderer.create(
      <SettingsButton
        title='8923b772-b0b3-4cb9-9ec1-f08516a80dd5'
        onPress={() => {}}
        loading={true}
        loadingTitle='85361618-e8d1-4284-9f2c-928cf417c323'
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
