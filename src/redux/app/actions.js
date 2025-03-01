export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}
const actions = {
  COLLPSE_CHANGE: 'COLLPSE_CHANGE',
  COLLPSE_OPEN_DRAWER: 'COLLPSE_OPEN_DRAWER',
  CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
  TOGGLE_ALL: 'TOGGLE_ALL',
  CHANGE_CURRENT: 'CHANGE_CURRENT',
  CLEAR_MENU: 'CLEAR_MENU',
  SET_GENERAL_DATA: 'SET_GENERAL_DATA',
  FETCH_COMMON_DATA: 'FETCH_COMMON_DATA',
  SET_CURRENT_COUNTRY: 'SET_CURRENT_COUNTRY',
  SET_COUNTRY: 'SET_COUNTRY',

  toggleCollapsed: () => ({
    type: actions.COLLPSE_CHANGE,
  }),
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },
  toggleOpenDrawer: () => ({
    type: actions.COLLPSE_OPEN_DRAWER,
  }),
  changeOpenKeys: (openKeys) => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys,
  }),
  changeCurrent: (current) => ({
    type: actions.CHANGE_CURRENT,
    current,
  }),
  clearMenu: () => ({ type: actions.CLEAR_MENU }),
  setCommonData: () => ({ type: actions.FETCH_COMMON_DATA }),
  setCommonObj: (data) => ({ type: actions.SET_GENERAL_DATA, data }),
  setCurrentCountry: (data) => ({
    type: actions.SET_CURRENT_COUNTRY,
    country: data,
  }),
};
export default actions;
