import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const settingConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/setting",
    component: React.lazy(() => import("./setting")),
  },
];
