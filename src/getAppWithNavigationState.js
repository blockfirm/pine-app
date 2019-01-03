import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import AppNavigator from './navigators/AppNavigator';

const getAppWithNavigationState = () => {
  const App = reduxifyNavigator(createAppContainer(AppNavigator), 'root');

  const mapStateToProps = (state) => ({
    state: state.nav
  });

  return connect(mapStateToProps)(App);
};

export default getAppWithNavigationState;
