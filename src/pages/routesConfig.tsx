import { HiOutlineMailOpen, HiOutlineUserGroup } from "react-icons/hi";
import { GrScorecard } from "react-icons/gr";
import { FcRating } from "react-icons/fc";
import { BsClipboardCheck, BsClockHistory } from "react-icons/bs";
import { VscLaw } from "react-icons/vsc";
import { GiLevelEndFlag } from "react-icons/gi";
import { FiAward, FiGlobe } from "react-icons/fi";
import { BiCategory, BiErrorAlt, BiUserPin } from "react-icons/bi";
import { RiAdminLine, RiCalendarEventFill } from "react-icons/ri";
import { BsListCheck, BsFileEarmarkCode } from "react-icons/bs";
import {
  MdOutlineManageSearch,
  MdOutlineManageAccounts,
  MdReportGmailerrorred,
} from "react-icons/md";
import { AiOutlineDashboard, AiOutlineSetting } from "react-icons/ai";
import { ReactNode } from "react";
import { RoutePermittedRole } from "../shared/constants/AppConst";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { IoLanguageOutline } from "react-icons/io5";
import { IoTimerOutline } from "react-icons/io5";
export interface RouterConfigData {
  id: string;
  title: string;
  messageId: string;
  icon?: string | ReactNode;
  type: "item" | "group" | "collapse" | "divider";
  children?: RouterConfigData[];
  permittedRole?: RoutePermittedRole;
  color?: string;
  url?: string;
  exact?: boolean;
  count?: number;
  isSuperAdmin?: boolean;
}

const routesConfig: RouterConfigData[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    messageId: "sidebar.app.dashboard.dashboard",
    type: "item",
    icon: <AiOutlineDashboard />,
    url: "/dashboard",
  },
  {
    id: "admins",
    title: "Admins",
    messageId: "sidebar.app.dashboard.admins",
    type: "item",
    icon: <RiAdminLine />,
    url: "/admin-lists",
    isSuperAdmin: true,
  },
  {
    id: "users",
    title: "User",
    messageId: "sidebar.app.dashboard.users",
    type: "collapse",
    icon: <HiOutlineUserGroup />,
    children: [
      {
        id: "activeusers",
         title: "Active",
        messageId: "sidebar.app.dashboard.activeusers",
        type: "item",
        icon: <FiUserCheck />,
        url: "/user",
      },
      {
        id: "blockedusers",
        title: "Blocked",
        messageId: "sidebar.app.dashboard.blockedusers",
        type: "item",
        icon: <FiUserX />,
        url: "/blocked-users",
      },
    ],
  },
  {
    id: "management",
    title: "Management",
    messageId: "sidebar.app.dashboard.manage",
    type: "collapse",
    icon: <MdOutlineManageAccounts />,
    children: [
      {
        id: "defaultOtp",
        title: "Default Otp",
        messageId: "sidebar.app.dashboard.defaultOtp",
        type: "item",
        icon: <FiGlobe />,
        url: "/default-otp",
      },
      // {
      //   id: "regions",
      //   title: "Regions",
      //   messageId: "sidebar.app.dashboard.regions",
      //   type: "item",
      //   icon: <FiGlobe />,
      //   url: "/regions",
      // },
      {
        id: "timezones",
        title: "Timezones",
        messageId: "sidebar.app.dashboard.timezone",
        type: "item",
        icon: <IoTimerOutline />,
        url: "/time-zone",
      },

      // {
      //   id: "markscore",
      //   title: "Marks & score",
      //   messageId: "sidebar.app.dashboard.markscore",
      //   type: "item",
      //   icon: <GrScorecard />,
      //   url: "/marks-score",
      // },
      {
        id: "av-requirements",
        title: "A & V Requirements",
        messageId: "sidebar.app.dashboard.av-requirements",
        type: "item",
        icon: <BsListCheck />,
        url: "/av-requirements",
      },
      {
        id: "awardsprices",
        title: "Awards & Prices",
        messageId: "sidebar.app.dashboard.awardsprices",
        type: "item",
        icon: <FiAward />,
        url: "/awards-prices",
      },
      {
        id: "judgementcriteria",
        title: "Judgement Criteria",
        messageId: "sidebar.app.dashboard.judgementcriteria",
        type: "item",
        icon: <FcRating />,
        url: "/judgement-criteria",
      },
      {
        id: "termsconditions",
        title: "Terms & Conditions",
        messageId: "sidebar.app.dashboard.termsconditions",
        type: "item",
        icon: <BsClipboardCheck />,
        url: "/terms-conditions",
      },
      {
        id: "privacypolicy",
        title: "Privacy Policy",
        messageId: "sidebar.app.dashboard.privacypolicy",
        type: "item",
        icon: <BsClockHistory />,
        url: "/privacy-policy",
      },
      {
        id: "rulesregulation",
        title: "Rules & Regulation",
        messageId: "sidebar.app.dashboard.rulesregulation",
        type: "item",
        icon: <VscLaw />,
        url: "/rules-regulation",
      },
      {
        id: "levels",
        title: "Levels",
        messageId: "sidebar.app.dashboard.levels",
        type: "item",
        icon: <GiLevelEndFlag />,
        url: "/levels",
      },
      {
        id: "emailtemplates",
        title: "Templates",
        messageId: "sidebar.app.dashboard.emailtemplates",
        type: "item",
        icon: <HiOutlineMailOpen />,
        url: "/emailtemplates",
      },
      // {
      //   id: "languages",
      //   title: "Languages",
      //   messageId: "sidebar.app.dashboard.languages",
      //   type: "item",
      //   icon: <IoLanguageOutline />,
      //   url: "/languages",
      // },
    ],
  },

  {
    id: "events",
    title: "Events",
    messageId: "sidebar.app.dashboard.events",
    type: "item",
    icon: <RiCalendarEventFill />,
    url: "/events",
  },
  {
    id: "dynamic",
    title: "Dynamic-Form",
    messageId: "sidebar.app.dashboard.dynamicForm",
    type: "collapse",
    icon: <AiOutlineSetting />,
    children: [
      {
        id: "eventform",
        title: "Event Form",
        messageId: "sidebar.app.dashboard.eventForm",
        type: "item",
        icon: <BiCategory />,
        url: "/eventform",
      },
      {
        id: "userRegistration",
        title: "User Registration Form",
        messageId: "sidebar.app.dashboard.userRegForm",
        type: "item",
        icon: <BiUserPin />,
        url: "/userRegistrationform",
      },
    ],
  },
  {
    id: "category",
    title: "Category",
    messageId: "sidebar.app.dashboard.category",
    type: "collapse",
    icon: <AiOutlineSetting />,
    children: [
      {
        id: "category",
        title: "Category",
        messageId: "sidebar.app.dashboard.category",
        type: "item",
        icon: <BiCategory />,
        url: "/category",
      },
      {
        id: "subcategory",
        title: "Sub Category",
        messageId: "sidebar.app.dashboard.subcategory",
        type: "item",
        icon: <BsListCheck />,
        url: "/sub-category",
      },
    ],
  },

  // {
  //   id: "bugreports",
  //   title: "Bug Reports",
  //   messageId: "sidebar.app.dashboard.bugreports",
  //   type: "item",
  //   icon: <MdOutlineBugReport />,
  //   url: "/bugreports",
  // },
  // {
  //   id: "faq",
  //   title: "FAQ",
  //   messageId: "sidebar.pages.extraPages.faq",
  //   type: "item",
  //   icon: <MdOutlineQuestionAnswer />,
  //   url: "/faq",
  // },
  {
    id: "cms",
    title: "Cms",
    messageId: "sidebar.app.dashboard.cms",
    type: "item",
    icon: <BsListCheck />,
    url: "/cms",
  },
  {
    id: "settings",
    title: "Settings",
    messageId: "sidebar.app.dashboard.settings",
    type: "collapse",
    icon: <AiOutlineSetting />,
    children: [
      {
        id: "othersettings",
        title: "Settings",
        messageId: "sidebar.app.dashboard.settings",
        type: "item",
        icon: <BsListCheck />,
        url: "/setting",
      },
      // {
      //   id: "commonsettings",
      //   title: "Common Settings",
      //   messageId: "sidebar.app.dashboard.commonsettings",
      //   type: "item",
      //   icon: <BsListCheck />,
      //   url: "/common-settings",
      // },
    ],
  },
  {
    id: "reports",
    title: "Report Forms",
    messageId: "sidebar.app.dashboard.reportForm",
    type: "collapse",
    icon: <MdReportGmailerrorred />,
    children: [
      {
        id: "eventRequestForm",
        title: "event report Form",
        messageId: "sidebar.app.dashboard.eventForm",
        type: "item",
        icon: <BsListCheck />,
        url: "/event-report-form",
      },
      {
        id: "organizerRequestForm",
        title: "organizer report Form",
        messageId: "sidebar.app.dashboard.organizerForm",
        type: "item",
        icon: <BsListCheck />,
        url: "/organizer-report-form",
      },
      {
        id: "judgeRequestForm",
        title: "judge report Form",
        messageId: "sidebar.app.dashboard.judgeForm",
        type: "item",
        icon: <BsListCheck />,
        url: "/judge-report-form",
      },
      {
        id: "ParticipantReportForm",
        title: "Participant report Form",
        messageId: "sidebar.app.dashboard.participantForm",
        type: "item",
        icon: <BsListCheck />,
        url: "/participant-report-form",
      },
      {
        id: "AudienceReportForm",
        title: "Audience report Form",
        messageId: "sidebar.app.dashboard.audienceForm",
        type: "item",
        icon: <BsListCheck />,
        url: "/audience-report-form",
      },
    ],
  },
  {
    id: "errorlog",
    title: "Error Logs",
    messageId: "sidebar.app.dashboard.errorlog",
    type: "item",
    icon: <BiErrorAlt />,
    url: "/errorlog",
    isSuperAdmin: true,
  },
  {
    id: "adminlogs",
    title: "Admin Logs",
    messageId: "sidebar.app.dashboard.adminlogs",
    type: "item",
    icon: <BsFileEarmarkCode />,
    url: "/adminlogs",
    isSuperAdmin: true,
  },
];
export default routesConfig;
