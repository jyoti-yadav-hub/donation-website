import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const RaceListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/race-list",
    component: React.lazy(() => import("./race-list")),
  },
];

export const ReligionListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/religion-list",
    component: React.lazy(() => import("./religion-list")),
  },
];
