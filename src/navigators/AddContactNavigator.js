import AddContactScreen from '../screens/AddContactScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const AddContactNavigator = createDismissableStackNavigator({
  AddContact: { screen: AddContactScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'AddContact'
});

export default AddContactNavigator;
