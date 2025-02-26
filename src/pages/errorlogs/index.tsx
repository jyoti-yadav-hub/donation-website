import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const errorLogConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/errorlog",
    component: React.lazy(() => import("./errorlog")),
  },
];
