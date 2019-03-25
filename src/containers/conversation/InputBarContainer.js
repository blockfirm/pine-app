import { connect } from 'react-redux';
import InputBar from '../../components/conversation/InputBar';

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.settings.currency.primary,
    secondaryCurrency: state.settings.currency.secondary,
    defaultBitcoinUnit: state.settings.bitcoin.unit
  };
};

export default connect(mapStateToProps)(InputBar);
