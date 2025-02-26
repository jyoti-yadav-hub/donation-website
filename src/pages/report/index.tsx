import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const EventReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/event-report-form",
    component: React.lazy(() => import("./report-form")),
  },
];

export const JudgeReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/judge-report-form",
    component: React.lazy(() => import("./report-form")),
  },
];

export const ParticipantReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/participant-report-form",
    component: React.lazy(() => import("./report-form")),
  },
];

export const AudienceReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/audience-report-form",
    component: React.lazy(() => import("./report-form")),
  },
];

export const OrganizerReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/organizer-report-form",
    component: React.lazy(() => import("./report-form")),
  },
];
