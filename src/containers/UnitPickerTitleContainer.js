import { connect } from 'react-redux';
import UnitPickerTitle from '../components/UnitPickerTitle';

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.settings.currency.primary,
    secondaryCurrency: state.settings.currency.secondary
  };
};

const UnitPickerTitleConnector = connect(
  mapStateToProps
)(UnitPickerTitle);

export default UnitPickerTitleConnector;
