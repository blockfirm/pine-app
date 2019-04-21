import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsByContactReducer from './itemsByContact';

const messagesReducer = combineReducers({
  error: errorReducer,
  itemsByContact: itemsByContactReducer
});

export default messagesReducer;
