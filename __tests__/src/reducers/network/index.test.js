import networkReducer from '../../../../src/reducers/network';

jest.mock('../../../../src/reducers/network/internet', () => {
  return jest.fn(() => '174e654d-c319-46bd-89e9-137294209af7');
});

jest.mock('../../../../src/reducers/network/server', () => {
  return jest.fn(() => 'fc10a56a-f305-49ca-b176-f39bbafce46c');
});

jest.mock('../../../../src/reducers/network/pine', () => {
  return jest.fn(() => '5b4b6a3a-2c7f-464e-bc46-ceb803e9c1f1');
});

describe('networkReducer', () => {
  let newState;

  beforeEach(() => {
    const oldState = {
      internet: '829216d2-961e-48b5-8b2a-84ceb4226442',
      server: 'e3ab4e40-8611-44af-ba43-6e102833a7fb'
    };

    const action = {
      type: 'NETWORK_INTERNET_DISCONNECTED'
    };

    newState = networkReducer(oldState, action);
  });

  it('is a function', () => {
    expect(typeof networkReducer).toBe('function');
  });

  it('sets .internet to the return value from internet()', () => {
    // This value is mocked at the top.
    expect(newState.internet).toBe('174e654d-c319-46bd-89e9-137294209af7');
  });

  it('sets .server to the return value from server()', () => {
    // This value is mocked at the top.
    expect(newState.server).toBe('fc10a56a-f305-49ca-b176-f39bbafce46c');
  });

  it('sets .pine to the return value from pine()', () => {
    // This value is mocked at the top.
    expect(newState.pine).toBe('5b4b6a3a-2c7f-464e-bc46-ceb803e9c1f1');
  });
});
