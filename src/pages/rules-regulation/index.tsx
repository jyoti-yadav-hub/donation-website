import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const RulesRegulationConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/rules-regulation",
    component: React.lazy(() => import("./rules-regulation")),
  },
];
