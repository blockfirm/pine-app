import createStore from '../../src/createStore';

describe('createStore()', () => {
  it('is a function', () => {
    expect(typeof createStore).toBe('function');
  });

  it('accepts one argument', () => {
    expect(createStore.length).toBe(1);
  });
});
