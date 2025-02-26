import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const DriveTypesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/drive-types",
    component: React.lazy(() => import("./drive-types")),
  },
];
