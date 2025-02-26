import {
  HelpBadgeCountType,
  SET_HELP_BADGE_COUNT,
} from "types/actions/HelpBadgeCount.actions";

export interface HelpBadgeCountData {
  helpBadgeCount: any;
}

const initState: HelpBadgeCountData = { helpBadgeCount: 0 };

export default function authReducer(
  state = initState,
  action: HelpBadgeCountType
) {
  switch (action.type) {
    case SET_HELP_BADGE_COUNT:
      return {
        ...state,
        helpBadgeCount: action.helpBadgeCount,
      };
    default:
      return state;
  }
}
