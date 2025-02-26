import { getDefaultPath } from '../../shared/helpers/url_sync';
import { isServer } from '../../shared//helpers/isServer';
import { getCountry } from '../../shared//helpers/utility';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();
const country = getCountry();

const initState = {
  collapsed: !(!isServer && window.innerWidth > 1220),
  view: !isServer && getView(window.innerWidth),
  height: !isServer && window.innerHeight,
  openDrawer: false,
  openKeys: preKeys,
  current: preKeys,
  commonData: {},
  currentCountry: country,
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.COLLPSE_CHANGE:
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    case actions.COLLPSE_OPEN_DRAWER:
      return {
        ...state,
        openDrawer: !state.openDrawer,
      };
    case actions.TOGGLE_ALL:
      if (state.view !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return {
          ...state,
          collapsed: action.collapsed,
          view: action.view,
          height,
        };
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return {
        ...state,
        openKeys: action.openKeys,
      };
    case actions.CHANGE_CURRENT:
      return {
        ...state,
        current: action.current,
      };
    case actions.CLEAR_MENU:
      return {
        ...state,
        openKeys: [],
        current: [],
      };
    case actions.SET_GENERAL_DATA:
      return {
        ...state,
        commonData: action.data
          ? action.data
          : {
              ...state.commonData,
              loading: action.loading,
            },
      };
    case actions.SET_COUNTRY:
      return {
        ...state,
        currentCountry: action.country || '',
      };

    default:
      return state;
  }
  return state;
}
