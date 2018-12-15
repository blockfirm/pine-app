import { combineReducers } from 'redux';
import deviceTokenReducer from './deviceToken';
import permissionsReducer from './permissions';

const notificationsReducer = combineReducers({
  deviceToken: deviceTokenReducer,
  permissions: permissionsReducer
});

export default notificationsReducer;
