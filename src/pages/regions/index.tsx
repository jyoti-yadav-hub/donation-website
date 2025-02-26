import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const RegionsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/regions",
    component: React.lazy(() => import("./regions")),
  },
];
