import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const LevelsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/levels",
    component: React.lazy(() => import("./levels")),
  },
];
