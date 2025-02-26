import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const CSVFilesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/csvfiles",
    component: React.lazy(() => import("./csvfiles")),
  },
];
