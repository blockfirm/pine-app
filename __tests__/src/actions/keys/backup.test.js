import iCloudStorage from 'react-native-icloudstore';

import {
  backup as backupMnemonic,
  KEYS_BACKUP_REQUEST,
  KEYS_BACKUP_SUCCESS,
  KEYS_BACKUP_FAILURE
} from '../../../../src/actions/keys/backup';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

describe('KEYS_BACKUP_REQUEST', () => {
  it('equals "KEYS_BACKUP_REQUEST"', () => {
    expect(KEYS_BACKUP_REQUEST).toBe('KEYS_BACKUP_REQUEST');
  });
});

describe('KEYS_BACKUP_SUCCESS', () => {
  it('equals "KEYS_BACKUP_SUCCESS"', () => {
    expect(KEYS_BACKUP_SUCCESS).toBe('KEYS_BACKUP_SUCCESS');
  });
});

describe('KEYS_BACKUP_FAILURE', () => {
  it('equals "KEYS_BACKUP_FAILURE"', () => {
    expect(KEYS_BACKUP_FAILURE).toBe('KEYS_BACKUP_FAILURE');
  });
});

describe('backup', () => {
  let mnemonic;

  beforeEach(() => {
    mnemonic = 'test test test test test test test test test test test test';
    iCloudStorage.setItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof backupMnemonic).toBe('function');
  });

  it('accepts one argument', () => {
    expect(backupMnemonic.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = backupMnemonic(mnemonic);
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type KEYS_BACKUP_REQUEST', () => {
    backupMnemonic(mnemonic)(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: KEYS_BACKUP_REQUEST
    });
  });

  it('stores the mnemonic in iCloud', () => {
    expect.hasAssertions();

    return backupMnemonic(mnemonic)(dispatchMock).then(() => {
      expect(iCloudStorage.setItem).toHaveBeenCalledWith(ICLOUD_STORAGE_KEY, mnemonic);
    });
  });

  it('dispatches an action of type KEYS_BACKUP_SUCCESS', () => {
    expect.hasAssertions();

    return backupMnemonic(mnemonic)(dispatchMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_BACKUP_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from iCloudStorage.setItem().
      iCloudStorage.setItem.mockImplementationOnce(() => Promise.reject(
        new Error('fb3806a0-f762-4acb-b695-0e267539b702')
      ));

      promise = backupMnemonic(mnemonic)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('fb3806a0-f762-4acb-b695-0e267539b702');
      });
    });

    it('dispatches an action of type KEYS_BACKUP_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: KEYS_BACKUP_FAILURE,
          error
        });
      });
    });
  });
});
