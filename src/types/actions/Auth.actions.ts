import { AuthUser } from "../models/AuthUser";

export const UPDATE_AUTH_USER = "UPDATE_AUTH_USER";
export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const SIGNOUT_AUTH_SUCCESS = "SIGNOUT_AUTH_SUCCESS";

export const CHECK_AUTHORIZATION = "CHECK_AUTHORIZATION";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGOUT = "LOGOUT";
export const LOGOUT_SAGA = "LOGOUT_SAGA";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const SET_USER = "SET_USER";
export const SET_USER_OBJ = "SET_USER_OBJ";
export const SET_LOGGED_OUT = "SET_LOGGED_OUT";

export interface SetAuthTokenActions {
  type: typeof SET_AUTH_TOKEN;
  payload: string | null;
}

export interface UpdateAuthUserActions {
  type: typeof UPDATE_AUTH_USER;
  payload: AuthUser | null;
}

export interface SignoutAuthUserActions {
  type: typeof SIGNOUT_AUTH_SUCCESS;
}

export interface CheckAutorityActions {
  type: typeof CHECK_AUTHORIZATION;
}

export interface LoginRequestActions {
  type: typeof LOGIN_REQUEST;
  // payload: LogAuth;
  token: string;
  user: any;
}

export interface LogoutActions {
  type: typeof LOGOUT_SAGA;
}

export interface SetUserActions {
  type: typeof SET_USER;
  user: any;
}

export interface SetLogOutActions {
  type: typeof SET_LOGGED_OUT;
}

export type AuthActionsTypes =
  | UpdateAuthUserActions
  | SetAuthTokenActions
  | SignoutAuthUserActions
  
  | LoginRequestActions
  | LogoutActions
  | SetUserActions
  | SetLogOutActions
  | CheckAutorityActions;
