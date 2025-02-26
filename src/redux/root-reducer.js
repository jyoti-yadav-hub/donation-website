import { combineReducers } from "redux";
import App from "./app/reducer";
import Auth from "./auth/reducer";

export default combineReducers({
  Auth,
  App,
});
