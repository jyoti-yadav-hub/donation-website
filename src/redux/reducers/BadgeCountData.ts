import {
  BadgeCountType,
  SET_BADGE_COUNT,
} from "types/actions/BadgeCount.actions";

export interface BadgeCountData {
  badgeCount: any;
}

const initState: BadgeCountData = { badgeCount: 0 };

export default function authReducer(state = initState, action: BadgeCountType) {
  switch (action.type) {
    case SET_BADGE_COUNT:
      return {
        ...state,
        badgeCount: action.badgeCount,
      };
    default:
      return state;
  }
}
