import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const adminLogsConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/adminlogs",
    component: React.lazy(() => import("./adminlogs")),
  },
];
