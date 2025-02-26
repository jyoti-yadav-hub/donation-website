import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const BankListsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/users-bank-list",
    component: React.lazy(() => import("./users-bank-list")),
  },
];
