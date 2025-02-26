import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const BugReportsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/bugreports",
    component: React.lazy(() => import("./bugreports")),
  },
];
