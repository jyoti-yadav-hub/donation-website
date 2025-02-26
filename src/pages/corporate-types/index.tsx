import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const CorporateTypesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/corporate-types",
    component: React.lazy(() => import("./corporate-types")),
  },
];
