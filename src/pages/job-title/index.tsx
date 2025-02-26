import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const JobTitleConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/job-title",
    component: React.lazy(() => import("./job-title")),
  },
];
