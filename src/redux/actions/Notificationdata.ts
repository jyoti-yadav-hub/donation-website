
import { Dispatch } from "redux";
import { NotiActionsTypes, SET_NOTIFICATION } from "types/actions/Notification.actions";

export const setNotification = (notiData: any) => {
  return (dispatch: Dispatch<NotiActionsTypes>) => {
    dispatch({ type: SET_NOTIFICATION, notiData: notiData});
  }
};
