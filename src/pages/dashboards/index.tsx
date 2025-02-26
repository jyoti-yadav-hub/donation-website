import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const dashBoardConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/dashboard",
    component: React.lazy(() => import("./dashboard")),
  },
];
