import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const AdminListsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/admin-lists",
    component: React.lazy(() => import("./admin-lists")),
  },
];
