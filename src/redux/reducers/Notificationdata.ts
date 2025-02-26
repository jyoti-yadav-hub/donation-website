import {
  NotiActionsTypes,
  SET_NOTIFICATION,
} from "types/actions/Notification.actions";

export interface NotiData {
  notiData: object;
}

const initState: NotiData = { notiData: {} };

export default function authReducer(
  state = initState,
  action: NotiActionsTypes
) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        notiData: action.notiData,
      };
    default:
      return state;
  }
}
