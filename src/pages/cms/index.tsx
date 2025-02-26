import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const cmsConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/cms",
    component: React.lazy(() => import("./cms")),
  },
];

export const homeCmsConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/home-cms",
    component: React.lazy(() => import("./home-cms")),
  },
];
