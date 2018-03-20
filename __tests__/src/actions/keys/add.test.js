import {
  add as addKey,
  KEYS_ADD_REQUEST,
  KEYS_ADD_SUCCESS
} from '../../../../src/actions/keys/add';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const dispatchMock = jest.fn();

describe('KEYS_ADD_REQUEST', () => {
  it('equals "KEYS_ADD_REQUEST"', () => {
    expect(KEYS_ADD_REQUEST).toBe('KEYS_ADD_REQUEST');
  });
});

describe('KEYS_ADD_SUCCESS', () => {
  it('equals "KEYS_ADD_SUCCESS"', () => {
    expect(KEYS_ADD_SUCCESS).toBe('KEYS_ADD_SUCCESS');
  });
});

describe('add', () => {
  let fakeKey;

  beforeEach(() => {
    fakeKey = {};
  });

  it('is a function', () => {
    expect(typeof addKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addKey.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addKey(fakeKey);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addKey(fakeKey);
    });

    it('dispatches an action of type KEYS_ADD_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_ADD_REQUEST
      });
    });

    it('dispatches an action of type KEYS_ADD_SUCCESS with the key', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_ADD_SUCCESS,
        key: fakeKey
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('resolves to the passed key', () => {
        expect.hasAssertions();

        return promise.then((key) => {
          expect(key).toBe(fakeKey);
        });
      });
    });

    describe('when key.id is undefined', () => {
      it('sets key.id to a uuid (v4)', () => {
        fakeKey.id = undefined;
        returnedFunction(dispatchMock);
        expect(fakeKey.id).toMatch(uuidRegex);
      });
    });

    describe('when key.id is defined', () => {
      it('does not change key.id', () => {
        const fakeId = 'f046249a-9c24-4fff-9597-4373469ab7e1';

        fakeKey.id = fakeId;
        returnedFunction(dispatchMock);

        expect(fakeKey.id).toMatch(fakeId);
      });
    });
  });
});
