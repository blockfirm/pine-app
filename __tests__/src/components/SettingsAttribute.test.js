import React from 'react';
import renderer from 'react-test-renderer';
import SettingsAttribute from '../../../src/components/SettingsAttribute';

describe('SettingsAttribute', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsAttribute
        name='8e69990a-32bf-4daf-9a40-2be6c45dad18'
        value='8ed9d949-9a68-4a3d-b69d-0856a632dacc'
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as the last item', () => {
    const tree = renderer.create(
      <SettingsAttribute
        name='8e69990a-32bf-4daf-9a40-2be6c45dad18'
        value='8ed9d949-9a68-4a3d-b69d-0856a632dacc'
        isLastItem={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
