import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const PlansConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/planslist",
    component: React.lazy(() => import("./planslist")),
  },
];
