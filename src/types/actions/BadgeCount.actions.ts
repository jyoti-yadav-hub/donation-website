export const SET_BADGE_COUNT = "SET_BADGE_COUNT";

export interface SetBadgeCount {
  type: typeof SET_BADGE_COUNT;
  badgeCount: number | any;
}

export type BadgeCountType = SetBadgeCount;
