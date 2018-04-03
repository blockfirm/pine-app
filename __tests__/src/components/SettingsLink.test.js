import React from 'react';
import renderer from 'react-test-renderer';
import SettingsLink from '../../../src/components/SettingsLink';

describe('SettingsLink', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsLink
        name='72b47a5f-db79-4431-a2ca-612d97f547cc'
        value='e87b6472-bbd7-4a6d-833a-0c5030189213'
        onPress={() => {}}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as the last item', () => {
    const tree = renderer.create(
      <SettingsLink
        name='d8d6a18e-0553-44fa-9f68-158b7364bc5e'
        value='b40740ec-ccb1-41c6-8fa5-72147f467556'
        onPress={() => {}}
        isLastItem={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
