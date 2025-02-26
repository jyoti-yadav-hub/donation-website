import { Dispatch } from "redux";
import {
  BadgeCountType,
  SET_BADGE_COUNT,
} from "types/actions/BadgeCount.actions";

export const setBadgeCount = (badgeCount: any) => {
  return (dispatch: Dispatch<BadgeCountType>) => {
    dispatch({ type: SET_BADGE_COUNT, badgeCount: badgeCount });
  };
};
