import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const AvRequirementsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/av-requirements",
    component: React.lazy(() => import("./av-requirements")),
  },
];
