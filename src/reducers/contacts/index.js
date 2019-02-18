import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsReducer from './items';

const contactsReducer = combineReducers({
  error: errorReducer,
  items: itemsReducer
});

export default contactsReducer;
