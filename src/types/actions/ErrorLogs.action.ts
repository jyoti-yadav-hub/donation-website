export const GET_ERROR_LOGS = "GET_ERROR_LOGS";

export interface ErrObj {
  id: number;
}


export interface GetErrorLogActions {
  type: typeof GET_ERROR_LOGS;
  payload: {
    list: ErrObj[];
    total: number;
  };
}

export type ErrorActionTypes =
  | GetErrorLogActions
