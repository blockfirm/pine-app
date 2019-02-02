import { StyleSheet } from 'react-native';

const settingsStyles = StyleSheet.create({
  item: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    paddingRight: 30,
    marginLeft: 15,
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22
  },
  value: {
    textAlign: 'right',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    position: 'absolute',
    right: 15,
    width: '60%',
    color: '#8F8E94',
    backgroundColor: 'transparent'
  }
});

settingsStyles.underlayColor = '#FAFAFA';

export default settingsStyles;
