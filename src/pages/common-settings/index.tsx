import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const commonSettingConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/common-settings",
    component: React.lazy(() => import("./common-settings")),
  },
];
