import { Dispatch } from "redux";
import {
  HelpBadgeCountType,
  SET_HELP_BADGE_COUNT,
} from "types/actions/HelpBadgeCount.actions";

export const setHelpBadgeCount = (helpBadgeCount: any) => {
  return (dispatch: Dispatch<HelpBadgeCountType>) => {
    dispatch({ type: SET_HELP_BADGE_COUNT, helpBadgeCount: helpBadgeCount });
  };
};
