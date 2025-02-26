import actions from "./actions";

const token = localStorage.getItem("uToken");
const uData = localStorage.getItem("uData") || {};

const initState = { idToken: token, userData: uData, loggedOut: false };

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        idToken: action.token,
        userData: action.user,
      };
    case actions.LOGOUT: {
      const redirect = "signin";
      return {
        ...initState,
        idToken: null,
        userData: { redirect },
      };
    }
    case actions.SET_LOGGED_OUT:
      return {
        ...state,
        loggedOut: action.loading,
      };
    case actions.SET_USER_OBJ:
      return {
        ...state,
        userData: action.user ? action.user : {},
      };
    default:
      return state;
  }
}
