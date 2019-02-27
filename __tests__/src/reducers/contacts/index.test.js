import contactsReducer from '../../../../src/reducers/contacts';

jest.mock('../../../../src/reducers/contacts/error', () => {
  return jest.fn(() => '9b14cdef-995e-46a4-8d32-8cca7fc678dc');
});

jest.mock('../../../../src/reducers/contacts/items', () => {
  return jest.fn(() => '971a3963-ec37-4cd3-85dc-bc39e980736c');
});

describe('contactsReducer', () => {
  let newState;

  beforeEach(() => {
    const oldState = {
      error: 'e0c74d69-4521-4788-9294-b2fcaac047d0',
      items: {}
    };

    const action = {
      type: 'ACTION'
    };

    newState = contactsReducer(oldState, action);
  });

  it('is a function', () => {
    expect(typeof contactsReducer).toBe('function');
  });

  it('sets .error to the return value from error()', () => {
    // This value is mocked at the top.
    expect(newState.error).toBe('9b14cdef-995e-46a4-8d32-8cca7fc678dc');
  });

  it('sets .items to the return value from items()', () => {
    // This value is mocked at the top.
    expect(newState.items).toBe('971a3963-ec37-4cd3-85dc-bc39e980736c');
  });
});
