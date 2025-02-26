import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const SchoolsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/school-list",
    component: React.lazy(() => import("./schoollist")),
  },
];
