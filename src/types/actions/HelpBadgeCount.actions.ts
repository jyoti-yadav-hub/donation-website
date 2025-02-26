export const SET_HELP_BADGE_COUNT = "SET_HELP_BADGE_COUNT";

export interface SetHelpBadgeCount {
  type: typeof SET_HELP_BADGE_COUNT;
  helpBadgeCount: number | any;
}

export type HelpBadgeCountType = SetHelpBadgeCount;
