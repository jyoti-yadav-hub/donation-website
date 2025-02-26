import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const emailTempConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/emailtemplates",
    component: React.lazy(() => import("./emailtemplates")),
  },
];
