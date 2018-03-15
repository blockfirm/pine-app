import React from 'react';
import renderer from 'react-test-renderer';
import ErrorModal from '../../../src/components/ErrorModal';

describe('ErrorModal', () => {
  it('renders correctly without an error', () => {
    const tree = renderer.create(
      <ErrorModal />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with an error', () => {
    const error = new Error('76db4801-74ee-4d53-b7cd-08790f0f84c5');

    const tree = renderer.create(
      <ErrorModal error={error} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
