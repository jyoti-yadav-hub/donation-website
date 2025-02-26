
import { Dispatch } from "redux";
import { ActiveCategoryType, SET_ACTIVE_CATEGORY } from "types/actions/ActiveCategory.actions";

export const setActiveCategory = (selectedID: any) => {
  return (dispatch: Dispatch<ActiveCategoryType>) => {
    dispatch({ type: SET_ACTIVE_CATEGORY, selectedID: selectedID});
  }
};