import {
  GET_ERROR_LOGS,
  ErrorActionTypes,
} from "../../types/actions/ErrorLogs.action";

export interface ErrObj {
    id: number;
  }

const initialState: {ErrorsLogList: ErrObj[]} = {ErrorsLogList: []};

const ErrorLogsApp = (state = initialState, action: ErrorActionTypes) => {
  switch (action.type) {
    case GET_ERROR_LOGS:
      return {
        ...state,
        errLogsList: action.payload.list,
        totalErrLogs: action.payload.total,
      };
    default:
      return state;
  }
}
export default ErrorLogsApp;
