import { navigateWithReset } from '../../../src/actions/navigateWithReset';

describe('navigateWithReset', () => {
  let fakeRouteName;
  let fakeParams;

  beforeEach(() => {
    fakeRouteName = 'ddef6191-82a3-499c-b919-d542b293b47f';

    fakeParams = {
      id: 'fdfd3a99-3fe7-4ebe-a604-ef32c155bc08'
    };
  });

  it('is a function', () => {
    expect(typeof navigateWithReset).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(navigateWithReset.length).toBe(2);
  });

  it('returns an object', () => {
    const returnValue = navigateWithReset(fakeRouteName, fakeParams);

    expect(typeof returnValue).toBe('object');
    expect(returnValue).toBeTruthy();
  });

  describe('the returned object', () => {
    let returnValue;

    beforeEach(() => {
      returnValue = navigateWithReset(fakeRouteName, fakeParams);
    });

    it('has "type" set to "Navigation/RESET"', () => {
      expect(returnValue.type).toBe('Navigation/RESET');
    });

    it('has "index" set to 0', () => {
      expect(returnValue.index).toBe(0);
    });

    it('has "actions" set to an array', () => {
      expect(Array.isArray(returnValue.actions)).toBe(true);
    });

    describe('the "actions" array', () => {
      it('has one item', () => {
        expect(returnValue.actions.length).toBe(1);
      });

      describe('the first (and only) item', () => {
        let action;

        beforeEach(() => {
          action = returnValue.actions[0];
        });

        it('has "type" set to "Navigation/NAVIGATE"', () => {
          expect(action.type).toBe('Navigation/NAVIGATE');
        });

        it('has "routeName" set to the passed routeName', () => {
          expect(action.routeName).toBe(fakeRouteName);
        });

        it('has "params" set to the passed params', () => {
          expect(action.params).toBe(fakeParams);
        });
      });
    });
  });
});
