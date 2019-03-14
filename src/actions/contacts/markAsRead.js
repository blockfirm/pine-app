import { save } from './save';

export const CONTACTS_MARK_AS_READ = 'CONTACTS_MARK_AS_READ';

/**
 * Action to mark a contact as read.
 *
 * @param {object} contact - Contact to mark as read.
 */
export const markAsRead = (contact) => {
  return async (dispatch) => {
    if (!contact.unread) {
      return;
    }

    dispatch({
      type: CONTACTS_MARK_AS_READ,
      contact
    });

    return dispatch(save());
  };
};
