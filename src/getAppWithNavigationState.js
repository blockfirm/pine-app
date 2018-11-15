import { connect } from 'react-redux';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import AppNavigator from './navigators/AppNavigator';

const getAppWithNavigationState = () => {
  const App = reduxifyNavigator(AppNavigator, 'root');

  const mapStateToProps = (state) => ({
    state: state.nav
  });

  return connect(mapStateToProps)(App);
};

export default getAppWithNavigationState;
