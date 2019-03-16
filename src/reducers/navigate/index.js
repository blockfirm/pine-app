import { combineReducers } from 'redux';
import openConversationReducer from './openConversation';

const navigateReducer = combineReducers({
  openConversation: openConversationReducer
});

export default navigateReducer;
