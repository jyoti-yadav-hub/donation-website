import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const MarkScoreConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/marks-score",
    component: React.lazy(() => import("./marks-score")),
  },
];
