import { StyleSheet } from 'react-native';

const settingsStyles = StyleSheet.create({
  item: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    paddingRight: 30,
    marginLeft: 15,
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
    backgroundColor: 'transparent'
  }
});

export default settingsStyles;
