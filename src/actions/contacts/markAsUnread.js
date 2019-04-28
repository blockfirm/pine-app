import { save } from './save';

export const CONTACTS_MARK_AS_UNREAD = 'CONTACTS_MARK_AS_UNREAD';

/**
 * Action to mark a contact as unread.
 *
 * @param {Object} contact - Contact to mark as unread.
 * @param {boolean} [persist] - Whether to save the state to persistent storage or not.
 */
export const markAsUnread = (contact, persist = true) => {
  return async (dispatch) => {
    if (contact.unread) {
      return;
    }

    dispatch({
      type: CONTACTS_MARK_AS_UNREAD,
      contact
    });

    if (persist) {
      return dispatch(save());
    }
  };
};
