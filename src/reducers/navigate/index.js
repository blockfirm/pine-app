import { combineReducers } from 'redux';
import activeConversationReducer from './activeConversation';
import deferredOpenConversationReducer from './deferredOpenConversation';

const navigateReducer = combineReducers({
  activeConversation: activeConversationReducer,
  deferredOpenConversation: deferredOpenConversationReducer
});

export default navigateReducer;
