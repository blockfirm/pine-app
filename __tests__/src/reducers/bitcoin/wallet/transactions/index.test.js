import transactionsReducer from '../../../../../../src/reducers/bitcoin/wallet/transactions';

jest.mock('../../../../../../src/reducers/bitcoin/wallet/transactions/error', () => {
  return jest.fn(() => 'c7ca2f7b-0b0d-4744-b65a-1615e363c572');
});

jest.mock('../../../../../../src/reducers/bitcoin/wallet/transactions/items', () => {
  return jest.fn(() => 'af809498-7ab1-43d9-8d73-196fbf16e23c');
});

describe('transactionsReducer', () => {
  let newState;

  beforeEach(() => {
    const oldState = {
      error: '0d41586a-ee4a-46dc-9675-abdc36f5a2c1',
      items: []
    };

    const action = {
      type: 'ACTION'
    };

    newState = transactionsReducer(oldState, action);
  });

  it('is a function', () => {
    expect(typeof transactionsReducer).toBe('function');
  });

  it('sets .error to the return value from error()', () => {
    // This value is mocked at the top.
    expect(newState.error).toBe('c7ca2f7b-0b0d-4744-b65a-1615e363c572');
  });

  it('sets .items to the return value from items()', () => {
    // This value is mocked at the top.
    expect(newState.items).toBe('af809498-7ab1-43d9-8d73-196fbf16e23c');
  });
});
