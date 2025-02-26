
import { ActiveCategoryType, SET_ACTIVE_CATEGORY } from "types/actions/ActiveCategory.actions";

export interface ActiveCatData {
    selectedID: "",
}


const initState:ActiveCatData = { selectedID: "", };

export default function authReducer(state = initState, action: ActiveCategoryType) {
  switch (action.type) {
    case SET_ACTIVE_CATEGORY :
      return {
        ...state,
        selectedID: action.selectedID,
      };
    default:
      return state;
  }
}
