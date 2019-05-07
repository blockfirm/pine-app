import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsByContactReducer from './itemsByContact';
import txidsReducer from './txids';

const messagesReducer = combineReducers({
  error: errorReducer,
  itemsByContact: itemsByContactReducer,
  txids: txidsReducer
});

export default messagesReducer;
