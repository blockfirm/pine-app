import iCloudStorage from 'react-native-icloudstore';

import {
  recover as recoverMnemonic,
  KEYS_RECOVER_REQUEST,
  KEYS_RECOVER_SUCCESS,
  KEYS_RECOVER_FAILURE
} from '../../../../src/actions/keys/recover';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

describe('KEYS_RECOVER_REQUEST', () => {
  it('equals "KEYS_RECOVER_REQUEST"', () => {
    expect(KEYS_RECOVER_REQUEST).toBe('KEYS_RECOVER_REQUEST');
  });
});

describe('KEYS_RECOVER_SUCCESS', () => {
  it('equals "KEYS_RECOVER_SUCCESS"', () => {
    expect(KEYS_RECOVER_SUCCESS).toBe('KEYS_RECOVER_SUCCESS');
  });
});

describe('KEYS_RECOVER_FAILURE', () => {
  it('equals "KEYS_RECOVER_FAILURE"', () => {
    expect(KEYS_RECOVER_FAILURE).toBe('KEYS_RECOVER_FAILURE');
  });
});

describe('recover', () => {
  beforeEach(() => {
    iCloudStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof recoverMnemonic).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(recoverMnemonic.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = recoverMnemonic();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type KEYS_RECOVER_REQUEST', () => {
    recoverMnemonic()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: KEYS_RECOVER_REQUEST
    });
  });

  it('retrieves the mnemonic from iCloud', () => {
    expect.hasAssertions();

    return recoverMnemonic()(dispatchMock).then(() => {
      expect(iCloudStorage.getItem).toHaveBeenCalledWith(ICLOUD_STORAGE_KEY);
    });
  });

  it('dispatches an action of type KEYS_RECOVER_SUCCESS', () => {
    expect.hasAssertions();

    return recoverMnemonic()(dispatchMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_RECOVER_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from iCloudStorage.getItem().
      iCloudStorage.getItem.mockImplementationOnce(() => Promise.reject(
        new Error('d89cdc75-00d6-473f-864a-639421be9a05')
      ));

      promise = recoverMnemonic()(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('d89cdc75-00d6-473f-864a-639421be9a05');
      });
    });

    it('dispatches an action of type KEYS_RECOVER_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: KEYS_RECOVER_FAILURE,
          error
        });
      });
    });
  });
});
