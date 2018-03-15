import { combineReducers } from 'redux';
import errorReducer from './error';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer,
    error: errorReducer
  });

  return rootReducer;
};

export default getRootReducer;
