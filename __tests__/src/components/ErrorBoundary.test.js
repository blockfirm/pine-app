import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { ERROR_HANDLE } from '../../../src/actions/error';
import ErrorBoundary from '../../../src/components/ErrorBoundary';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(dispatchMock);
  }

  return action;
});

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
    it('dispatches an action of type ERROR_HANDLE with the error', () => {
      const error = new Error('11a8def9-f495-4cc9-aba4-181284bb2280');

      const errorBoundary = new ErrorBoundary({
        dispatch: dispatchMock
      });

      errorBoundary.componentDidCatch(error);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ERROR_HANDLE,
        error
      });
    });
  });
});
