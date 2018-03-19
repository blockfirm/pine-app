import { NavigationActions } from 'react-navigation';

export const navigateWithReset = (routeName, params) => {
  const action = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName, params })
    ]
  });

  return action;
};
