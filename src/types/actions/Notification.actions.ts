export const SET_NOTIFICATION = "SET_NOTIFICATION";


export interface SetNotification {
  type: typeof SET_NOTIFICATION;
  notiData: object | any;
}

export type NotiActionsTypes = SetNotification
