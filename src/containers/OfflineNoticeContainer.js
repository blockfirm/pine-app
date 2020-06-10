import { connect } from 'react-redux';
import OfflineNotice from '../components/OfflineNotice';

const mapStateToProps = (state) => ({
  isDisconnectedFromInternet: state.network.internet.disconnected
});

const OfflineNoticeConnector = connect(
  mapStateToProps
)(OfflineNotice);

export default OfflineNoticeConnector;
