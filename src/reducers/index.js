import { combineReducers } from 'redux';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer
  });

  return rootReducer;
};

export default getRootReducer;
