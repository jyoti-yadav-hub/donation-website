import Settings from "./Setting";
import Common from "./Common";
import Dashboard from "./Dashboard";
import Ecommerce from "./Ecommerce";
import ChatApp from "./ChatApp";
import MailApp from "./MailApp";
import ScrumBoard from "./ScrumboardApp";
import ContactApp from "./ContactApp";
import WallApp from "./WallApp";
import ToDoApp from "./ToDoApp";
import UserList from "./UserList";
import AuthData from "./Authdata";
import ErrorLogsApp from "./ErrorLogs";
import Notificationdata from "./Notificationdata";
import ActiveCategory from "./ActiveCategory";
import BadgeCountData from "./BadgeCountData";
import HelpBadgeCountData from "./HelpBadgeCountData";

const reducers = {
  settings: Settings,
  dashboard: Dashboard,
  ecommerce: Ecommerce,
  common: Common,
  chatApp: ChatApp,
  mailApp: MailApp,
  contactApp: ContactApp,
  scrumboardApp: ScrumBoard,
  wallApp: WallApp,
  todoApp: ToDoApp,
  userList: UserList,
  AuthData: AuthData,
  ErrorLogsApp: ErrorLogsApp,
  Notificationdata: Notificationdata,
  BadgeCountData: BadgeCountData,
  HelpBadgeCountData: HelpBadgeCountData,
  ActiveCategory: ActiveCategory,
};

export default reducers;
