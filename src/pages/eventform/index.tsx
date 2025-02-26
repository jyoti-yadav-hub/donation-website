import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const eventConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/eventform",
    component: React.lazy(() => import("./eventform")),
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: "/userRegistrationform",
    component: React.lazy(() => import("./userRegistrationForm")),
  },
];
