import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const TermsConditionsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/terms-conditions",
    component: React.lazy(() => import("./terms-conditions")),
  },
];
