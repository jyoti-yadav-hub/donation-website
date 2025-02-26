const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGOUT_SAGA: 'LOGOUT_SAGA',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  SET_USER: 'SET_USER',
  SET_USER_OBJ: 'SET_USER_OBJ',
  SET_LOGGED_OUT: 'SET_LOGGED_OUT',

  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (resData) => ({
    type: actions.LOGIN_REQUEST,
    payload: { token: resData.token, user: resData.user },
  }),
  setUserObj: (user, token) => ({
    type: actions.SET_USER,
    user,
    token,
  }),
  setLoggedOut: (loading) => ({
    type: actions.SET_LOGGED_OUT,
    loading,
  }),
  logout: () => ({
    type: actions.LOGOUT_SAGA,
  }),
};
export default actions;
