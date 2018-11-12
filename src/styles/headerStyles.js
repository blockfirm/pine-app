import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#A7A7AB',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  whiteHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
    color: 'black'
  }
});

export default headerStyles;
