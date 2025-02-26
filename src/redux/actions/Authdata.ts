import {
  CHECK_AUTHORIZATION,
  LOGIN_REQUEST,
  LOGOUT_SAGA,
  SET_USER,
  SET_LOGGED_OUT,
} from "../../types/actions/Auth.actions";
import { Dispatch } from "redux";
import { AppActions } from "../../types";
import { fetchStart, fetchSuccess } from "./Common";
import authHelper from "shared/common/library/helpers/authHelper";
import { toast } from "react-toastify";

export const checkAuthorization = () => ({ type: CHECK_AUTHORIZATION });

export const setUserObj = (user: any) => {
  return (dispatch: Dispatch<AppActions>) => {
    localStorage.setItem("uData", JSON.stringify(user));
    dispatch({ type: SET_USER, user: user });
  };
};

export const setLoggedOut = () => ({ type: SET_LOGGED_OUT });
export const logout = () => ({ type: LOGOUT_SAGA });

export const logoutWithoutToken = () => {
  return (dispatch: Dispatch<AppActions>) => {
    localStorage.removeItem("uToken");
    localStorage.removeItem("uData");
    dispatch({ type: LOGOUT_SAGA, token: null, user: {} });
  };
};

export const logoutAction = (data: any, setLoader: any) => {
  return (dispatch: Dispatch<AppActions>) => {
    setLoader(true);
    dispatch(fetchStart());
    authHelper
      .logout(data)
      .then((data) => {
        if (data.success) {
          dispatch(fetchSuccess());
          localStorage.removeItem("uToken");
          localStorage.removeItem("uData");
          dispatch({
            type: LOGOUT_SAGA,
            token: null,
            user: {},
          });
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        toast.error(error.message);
      });
  };
};

export const loginAction = (data: any) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    authHelper
      .login(data)
      .then((data) => {
        if (data.success) {
          dispatch(fetchSuccess());
          localStorage.setItem("uToken", data.data.token);
          localStorage.setItem("uData", JSON.stringify(data.data.user));
          dispatch({
            type: LOGIN_REQUEST,
            token: data.data.token,
            user: data.data.user,
          });
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
};

// const actions = {
//     CHECK_AUTHORIZATION: "CHECK_AUTHORIZATION",
//     LOGIN_REQUEST: "LOGIN_REQUEST",
//     LOGOUT: "LOGOUT",
//     LOGOUT_SAGA: "LOGOUT_SAGA",
//     LOGIN_SUCCESS: "LOGIN_SUCCESS",
//     LOGIN_ERROR: "LOGIN_ERROR",
//     SET_USER: "SET_USER",
//     SET_USER_OBJ: "SET_USER_OBJ",
//     SET_LOGGED_OUT: "SET_LOGGED_OUT",

//     checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
//     setLoginData: (resData) => ({
//       type: actions.LOGIN_REQUEST,
//       payload: { token: resData.token, user: resData.user },
//     }),
//     setUserObj: (user, token) => ({
//       type: actions.SET_USER,
//       user,
//       token,
//     }),
//     setLoggedOut: (loading) => ({
//       type: actions.SET_LOGGED_OUT,
//       loading,
//     }),
//     logout: () => ({
//       type: actions.LOGOUT_SAGA,
//     }),
//   };
//   export default actions;
