import { connect } from 'react-redux';
import InputBar from '../../components/conversation/InputBar';

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.settings.currency.primary,
    secondaryCurrency: state.settings.currency.secondary,
    defaultBitcoinUnit: state.settings.bitcoin.unit,
    spendableBalance: state.bitcoin.wallet.spendableBalance,
    fiatRates: state.bitcoin.fiat.rates
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(InputBar);
