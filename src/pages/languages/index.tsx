import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const LanguagesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/languages",
    component: React.lazy(() => import("./languages")),
  },
];
