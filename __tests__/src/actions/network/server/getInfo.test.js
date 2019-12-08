import * as api from '../../../../../src/clients/api';

import {
  getInfo,
  NETWORK_SERVER_GET_INFO_REQUEST,
  NETWORK_SERVER_GET_INFO_SUCCESS,
  NETWORK_SERVER_GET_INFO_FAILURE
} from '../../../../../src/actions/network/server/getInfo';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: 'c7f47dce-d788-4042-8793-6c077c5119aa'
    }
  }
}));

jest.mock('../../../../../src/clients/api', () => ({
  info: {
    get: jest.fn(() => Promise.resolve({
      isConnected: true,
      network: 'd4fe87c1-2090-44eb-a482-af48f069af55',
      blocks: 12345
    }))
  }
}));

describe('NETWORK_SERVER_GET_INFO_REQUEST', () => {
  it('equals "NETWORK_SERVER_GET_INFO_REQUEST"', () => {
    expect(NETWORK_SERVER_GET_INFO_REQUEST).toBe('NETWORK_SERVER_GET_INFO_REQUEST');
  });
});

describe('NETWORK_SERVER_GET_INFO_SUCCESS', () => {
  it('equals "NETWORK_SERVER_GET_INFO_SUCCESS"', () => {
    expect(NETWORK_SERVER_GET_INFO_SUCCESS).toBe('NETWORK_SERVER_GET_INFO_SUCCESS');
  });
});

describe('NETWORK_SERVER_GET_INFO_FAILURE', () => {
  it('equals "NETWORK_SERVER_GET_INFO_FAILURE"', () => {
    expect(NETWORK_SERVER_GET_INFO_FAILURE).toBe('NETWORK_SERVER_GET_INFO_FAILURE');
  });
});

describe('getInfo', () => {
  beforeEach(() => {
    api.info.get.mockClear();
  });

  it('is a function', () => {
    expect(typeof getInfo).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = getInfo();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getInfo();
    });

    it('dispatches an action of type NETWORK_SERVER_GET_INFO_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: NETWORK_SERVER_GET_INFO_REQUEST
      });
    });

    it('gets the info with api.info.get() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: 'c7f47dce-d788-4042-8793-6c077c5119aa'
        };

        expect(api.info.get).toHaveBeenCalledTimes(1);
        expect(api.info.get).toHaveBeenCalledWith(expectedOptions);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type NETWORK_SERVER_GET_INFO_SUCCESS with the info from the API response', () => {
        expect.hasAssertions();

        return promise.then((info) => {
          expect(info.network).toBe('d4fe87c1-2090-44eb-a482-af48f069af55');

          expect(dispatchMock).toHaveBeenCalledWith({
            type: NETWORK_SERVER_GET_INFO_SUCCESS,
            info
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.info.get().
        api.info.get.mockImplementationOnce(() => Promise.reject(
          new Error('9def4f6a-8305-40e8-98d9-c33c1393e20f')
        ));

        promise = getInfo()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('9def4f6a-8305-40e8-98d9-c33c1393e20f');
        });
      });

      it('dispatches an action of type NETWORK_SERVER_GET_INFO_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: NETWORK_SERVER_GET_INFO_FAILURE,
            error
          });
        });
      });
    });
  });
});
