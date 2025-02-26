import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const UserRolesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/user-roles",
    component: React.lazy(() => import("./user-roles")),
  },
];
