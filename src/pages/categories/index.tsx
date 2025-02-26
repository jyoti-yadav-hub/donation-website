import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const categoriesConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/categories",
    component: React.lazy(() => import("./categories")),
  },
];
