import iCloudStorage from 'react-native-icloudstore';

import {
  removeBackup,
  KEYS_REMOVE_BACKUP_REQUEST,
  KEYS_REMOVE_BACKUP_SUCCESS,
  KEYS_REMOVE_BACKUP_FAILURE
} from '../../../../src/actions/keys/removeBackup';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

describe('KEYS_REMOVE_BACKUP_REQUEST', () => {
  it('equals "KEYS_REMOVE_BACKUP_REQUEST"', () => {
    expect(KEYS_REMOVE_BACKUP_REQUEST).toBe('KEYS_REMOVE_BACKUP_REQUEST');
  });
});

describe('KEYS_REMOVE_BACKUP_SUCCESS', () => {
  it('equals "KEYS_REMOVE_BACKUP_SUCCESS"', () => {
    expect(KEYS_REMOVE_BACKUP_SUCCESS).toBe('KEYS_REMOVE_BACKUP_SUCCESS');
  });
});

describe('KEYS_REMOVE_BACKUP_FAILURE', () => {
  it('equals "KEYS_REMOVE_BACKUP_FAILURE"', () => {
    expect(KEYS_REMOVE_BACKUP_FAILURE).toBe('KEYS_REMOVE_BACKUP_FAILURE');
  });
});

describe('removeBackup', () => {
  beforeEach(() => {
    iCloudStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeBackup).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(removeBackup.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = removeBackup();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type KEYS_REMOVE_BACKUP_REQUEST', () => {
    removeBackup()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: KEYS_REMOVE_BACKUP_REQUEST
    });
  });

  it('removes the mnemonic from iCloud', () => {
    expect.hasAssertions();

    return removeBackup()(dispatchMock).then(() => {
      expect(iCloudStorage.removeItem).toHaveBeenCalledWith(ICLOUD_STORAGE_KEY);
    });
  });

  it('dispatches an action of type KEYS_REMOVE_BACKUP_SUCCESS', () => {
    expect.hasAssertions();

    return removeBackup()(dispatchMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_REMOVE_BACKUP_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from iCloudStorage.removeItem().
      iCloudStorage.removeItem.mockImplementationOnce(() => Promise.reject(
        new Error('d89cdc75-00d6-473f-864a-639421be9a05')
      ));

      promise = removeBackup()(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('d89cdc75-00d6-473f-864a-639421be9a05');
      });
    });

    it('dispatches an action of type KEYS_REMOVE_BACKUP_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: KEYS_REMOVE_BACKUP_FAILURE,
          error
        });
      });
    });
  });
});
