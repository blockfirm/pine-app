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
    return action(dispatchMock);
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
  let pineAddress;

  beforeEach(() => {
    mnemonic = 'test test test test test test test test test test test test';
    pineAddress = 'test@pine.dev';
    iCloudStorage.setItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof backupMnemonic).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(backupMnemonic.length).toBe(2);
  });

  it('returns a function', () => {
    const returnValue = backupMnemonic(mnemonic, pineAddress);
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type KEYS_BACKUP_REQUEST', () => {
    backupMnemonic(mnemonic, pineAddress)(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: KEYS_BACKUP_REQUEST
    });
  });

  it('adds the mnemonic to the iCloud backup', () => {
    expect.hasAssertions();

    return backupMnemonic(mnemonic, pineAddress)(dispatchMock).then(() => {
      const args = iCloudStorage.setItem.mock.calls[0];

      expect(args[0]).toBe(ICLOUD_STORAGE_KEY);
      expect(args[1]).toContain(mnemonic);
    });
  });

  it('keeps existing backups', () => {
    // This is mocked in __mocks__/react-native-icloudstore.js.
    const oldMnemonic = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    expect.hasAssertions();

    return backupMnemonic(mnemonic, pineAddress)(dispatchMock).then(() => {
      const args = iCloudStorage.setItem.mock.calls[0];
      expect(args[1]).toContain(oldMnemonic);
    });
  });

  it('dispatches an action of type KEYS_BACKUP_SUCCESS', () => {
    expect.hasAssertions();

    return backupMnemonic(mnemonic, pineAddress)(dispatchMock).then(() => {
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

      promise = backupMnemonic(mnemonic, pineAddress)(dispatchMock);
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
