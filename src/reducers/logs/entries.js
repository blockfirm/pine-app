import { LOGS_LOG, LOGS_CLEAR } from '../../actions/logs';

const entries = (state = [], action) => {
  switch (action.type) {
    case LOGS_LOG:
      state.push({
        timestamp: Date.now(),
        title: action.title,
        details: action.details
      });

      return state;

    case LOGS_CLEAR:
      return [];

    default:
      return state;
  }
};

export default entries;
