import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const JudgementCriteriaConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/judgement-criteria",
    component: React.lazy(() => import("./judgement-criteria")),
  },
];
