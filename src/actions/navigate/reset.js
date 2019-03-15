import { StackActions, NavigationActions } from 'react-navigation';

export const reset = (routeName, params) => {
  const action = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName, params })
    ]
  });

  return action;
};
