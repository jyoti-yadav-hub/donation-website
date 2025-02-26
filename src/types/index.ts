import { CommonActionTypes } from "./actions/Common.action";
import { SettingsActionTypes } from "./actions/Settings.action";
import { DashboardActionTypes } from "./actions/Dashboard.action";
import { EcommerceActionTypes } from "./actions/Ecommerce.action";
import { AuthActionsTypes } from "./actions/Auth.actions";
import { ChatActions } from "./actions/Chat.actions";
import { ContactActions } from "./actions/Contact.actions";
import { MailActions } from "./actions/Mail.action";
import { TaskActions } from "./actions/Todo.action";
import { WalltActions } from "./actions/Wall.actions";
import { ScrumboardActions } from "./actions/Scrumboard.actions";
import { UserListActions } from "./actions/UserList.actions";
import { ErrorActionTypes } from "./actions/ErrorLogs.action";
import { NotiActionsTypes } from "./actions/Notification.actions";
import { BadgeCountType } from "./actions/BadgeCount.actions";

export type AppActions =
  | CommonActionTypes
  | SettingsActionTypes
  | DashboardActionTypes
  | EcommerceActionTypes
  | AuthActionsTypes
  | ErrorActionTypes
  | ChatActions
  | MailActions
  | TaskActions
  | WalltActions
  | ScrumboardActions
  | ContactActions
  | NotiActionsTypes
  | UserListActions
  | BadgeCountType;
