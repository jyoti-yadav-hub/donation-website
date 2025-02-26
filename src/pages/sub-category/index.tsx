import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const subCategoryConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/sub-category",
    component: React.lazy(() => import("./sub-category")),
  },
];
