import { connect } from 'react-redux';
import OfflineNotice from '../components/OfflineNotice';

const mapStateToProps = (state) => {
  return {
    isDisconnectedFromInternet: state.network.internet.disconnected,
    isDisconnectedFromServer: state.network.server.disconnected,
    isDisconnectedFromPineServer: state.network.pine.disconnected
  };
};

const OfflineNoticeConnector = connect(
  mapStateToProps
)(OfflineNotice);

export default OfflineNoticeConnector;
