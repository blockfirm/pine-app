import { combineReducers } from 'redux';
import activeConversationReducer from './activeConversation';
import deferredOpenConversationReducer from './deferredOpenConversation';
import homeScreenReducer from './homeScreen';

const navigateReducer = combineReducers({
  activeConversation: activeConversationReducer,
  deferredOpenConversation: deferredOpenConversationReducer,
  homeScreen: homeScreenReducer
});

export default navigateReducer;
