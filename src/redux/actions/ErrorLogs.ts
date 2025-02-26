import { GET_ERROR_LOGS } from "../../types/actions/ErrorLogs.action";
import { Dispatch } from "redux";
import { AppActions } from "../../types";
import { fetchError, fetchStart, fetchSuccess } from "./Common";
import jwtAxios, { setAuthToken } from "../../@crema/services/auth/jwt-auth";
import getApiData from "../../shared/helpers/apiHelper";

export const onGetErrorLogList = (token) => {
  return (dispatch: Dispatch<AppActions>) => {
    const token = localStorage.getItem("uToken");
    dispatch(fetchStart());
    setAuthToken()
    getApiData("errorlog/list", { Authorization: `Bearer ${token}`,})
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ERROR_LOGS, payload: data.data });
        } else {
          dispatch(fetchError(String("message.somethingWentWrong")));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};
