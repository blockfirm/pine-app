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

iCloudStorage.getItem.mockImplementation(() => Promise.resolve(JSON.stringify([
  {
    pineAddress: 'test@pine.dev',
    mnemonic: 'd7b79b88-bac2-489c-8c94-c8f473f707a9'
  },
  {
    pineAddress: 'test2@pine.dev',
    mnemonic: '7fdd80fe-3cf6-4365-bdbf-dd244d470bf8'
  }
])));

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

  it('accepts one argument', () => {
    expect(recoverMnemonic.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = recoverMnemonic();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type KEYS_RECOVER_REQUEST', () => {
    expect.hasAssertions();

    return recoverMnemonic('test@pine.dev')(dispatchMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_RECOVER_REQUEST
      });
    });
  });

  it('retrieves the mnemonic from iCloud', () => {
    expect.hasAssertions();

    return recoverMnemonic('test@pine.dev')(dispatchMock).then(() => {
      expect(iCloudStorage.getItem).toHaveBeenCalledWith(ICLOUD_STORAGE_KEY);
    });
  });

  it('resolves to the mnemonic for the specified pine address', () => {
    expect.hasAssertions();

    return recoverMnemonic('test2@pine.dev')(dispatchMock).then((mnemonic) => {
      expect(mnemonic).toBe('7fdd80fe-3cf6-4365-bdbf-dd244d470bf8');
    });
  });

  it('resolves to the first mnemonic if no pine address is specified', () => {
    expect.hasAssertions();

    return recoverMnemonic()(dispatchMock).then((mnemonic) => {
      expect(mnemonic).toBe('d7b79b88-bac2-489c-8c94-c8f473f707a9');
    });
  });

  it('resolves to undefined if no mnemonics could be found', () => {
    expect.hasAssertions();

    iCloudStorage.getItem.mockImplementationOnce(() => Promise.resolve(JSON.stringify([
      {
        pineAddress: 'test3@pine.dev',
        mnemonic: '2219c3c8-99aa-4208-931a-25723d5188bd'
      }
    ])));

    return recoverMnemonic('test2@pine.dev')(dispatchMock).then((mnemonic) => {
      expect(mnemonic).toBeUndefined();
    });
  });

  it('resolves to undefined if there are no mnemonics', () => {
    expect.hasAssertions();

    iCloudStorage.getItem.mockImplementationOnce(() => Promise.resolve());

    return recoverMnemonic('test2@pine.dev')(dispatchMock).then((mnemonic) => {
      expect(mnemonic).toBeUndefined();
    });
  });

  it('dispatches an action of type KEYS_RECOVER_SUCCESS', () => {
    expect.hasAssertions();

    return recoverMnemonic('test@pine.dev')(dispatchMock).then(() => {
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
