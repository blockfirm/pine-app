import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { HANDLE_ERROR } from '../../../src/actions';
import ErrorBoundary from '../../../src/components/ErrorBoundary';

const dispatchMock = jest.fn();

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

describe('ErrorBoundary', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ErrorBoundary dispatch={dispatchMock}>
        <Text>496f7017-d1ef-430c-a2da-b2a4ac094798</Text>
      </ErrorBoundary>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#componentDidCatch(error)', () => {
    it('dispatches an action of type HANDLE_ERROR with the error', () => {
      const error = new Error('11a8def9-f495-4cc9-aba4-181284bb2280');

      const errorBoundary = new ErrorBoundary({
        dispatch: dispatchMock
      });

      errorBoundary.componentDidCatch(error);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: HANDLE_ERROR,
        error
      });
    });
  });
});
