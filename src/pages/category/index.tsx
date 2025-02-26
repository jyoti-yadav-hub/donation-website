import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const categoryConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/category",
    component: React.lazy(() => import("./category")),
  },
];
