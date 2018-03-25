import * as randombytes from 'react-native-randombytes';
import getRandomBytes from '../../../src/crypto/getRandomBytes';

describe('getRandomBytes', () => {
  beforeEach(() => {
    randombytes.randomBytes.mockClear();
  });

  it('is a function', () => {
    expect(typeof getRandomBytes).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getRandomBytes.length).toBe(1);
  });

  it('returns a promise', () => {
    const returnValue = getRandomBytes(8);
    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('calls randomBytes(size, callback) once with the size and a callback', () => {
    const size = 16;

    getRandomBytes(size);

    expect(randombytes.randomBytes.mock.calls.length).toBe(1);
    expect(randombytes.randomBytes.mock.calls[0][0]).toBe(size);
    expect(typeof randombytes.randomBytes.mock.calls[0][1]).toBe('function');
  });

  describe('when randomBytes(size, callback) callbacks an error', () => {
    it('rejects the promise', () => {
      const fakeError = new Error('6b6b6934-3d39-4675-8a55-53c8e104663d');

      randombytes.randomBytes.mockImplementationOnce((size, callback) => {
        callback(fakeError);
      });

      const promise = getRandomBytes(16);

      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBe(fakeError);
      });
    });
  });

  describe('when randomBytes(size, callback) does not callback an error', () => {
    it('resolves the promise with the second callback argument', () => {
      const fakeArgument = 'c3df242e-a257-41b7-8388-6fe94bd70baa';

      randombytes.randomBytes.mockImplementationOnce((size, callback) => {
        callback(null, fakeArgument);
      });

      const promise = getRandomBytes(16);

      expect.hasAssertions();

      return promise.then((result) => {
        expect(result).toBe(fakeArgument);
      });
    });
  });
});
