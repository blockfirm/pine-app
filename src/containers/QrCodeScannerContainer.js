import { connect } from 'react-redux';
import QrCodeScanner from '../components/QrCodeScanner';

const mapStateToProps = (state) => {
  return {
    network: state.settings.bitcoin.network
  };
};

const QrCodeScannerConnector = connect(
  mapStateToProps
)(QrCodeScanner);

export default QrCodeScannerConnector;
