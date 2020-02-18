import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsReducer from './items';
import itemsByMessageIdReducer from './itemsByMessageId';

const invoicesReducer = combineReducers({
  error: errorReducer,
  items: itemsReducer,
  itemsByMessageId: itemsByMessageIdReducer
});

export default invoicesReducer;
