import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import navigationDebouncer from 'react-navigation-redux-debouncer';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import getRootReducer from './reducers';

const reactNavigationReduxMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

export default (navReducer) => {
  const store = createStore(
    getRootReducer(navReducer),
    applyMiddleware(
      thunkMiddleware,
      reactNavigationReduxMiddleware,

      /* This middleware resolves the common problem with navigation actions being called twice if
       * you click fast enough. It will block all navigation actions during the predefined interval
       * after some navigation action has already been called.
       */
      navigationDebouncer()
    )
  );

  return store;
};
