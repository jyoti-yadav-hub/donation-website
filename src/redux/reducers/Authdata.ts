// import AuthData from '../actions/Authdata';

import {
  AuthActionsTypes,
  LOGIN_REQUEST,
  LOGOUT_SAGA,
  SET_USER,
  SET_LOGGED_OUT,
} from "../../types/actions/Auth.actions";

const token = localStorage.getItem("uToken");
const uData = JSON.parse(localStorage.getItem("uData") || "{}");

export interface AuthData {
  idToken: string | null;
  userData: any;
  loggedOut: boolean;
}

const initState: AuthData = {
  idToken: token,
  userData: uData,
  loggedOut: false,
};

export default function authReducer(
  state = initState,
  action: AuthActionsTypes
) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        idToken: action.token,
        userData: action.user,
      };
    case LOGOUT_SAGA: {
      const redirect = "signin";
      return {
        ...initState,
        idToken: null,
        userData: { redirect },
      };
    }
    case SET_LOGGED_OUT:
      return {
        ...state,
      };
    case SET_USER:
      return {
        ...state,
        userData: action.user,
      };
    default:
      return state;
  }
}
