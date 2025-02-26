import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const BanksConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/bank-list",
    component: React.lazy(() => import("./bank-list")),
  },
];
