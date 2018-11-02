import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#F7F7F7',
    borderBottomColor: '#B2B2B2',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  whiteHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'System',
    color: 'black'
  }
});

export default headerStyles;
