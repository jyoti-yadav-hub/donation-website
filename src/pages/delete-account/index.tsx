import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const DeleteAccFormConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/delete-account",
    component: React.lazy(() => import("./form-list")),
  },
];
