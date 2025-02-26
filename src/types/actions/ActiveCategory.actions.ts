export const SET_ACTIVE_CATEGORY = "SET_ACTIVE_CATEGORY";


export interface SetActiveCategory {
  type: typeof SET_ACTIVE_CATEGORY;
  selectedID: string | any;
}

export type ActiveCategoryType = SetActiveCategory