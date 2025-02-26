import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const HospitalsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/hospital-list",
    component: React.lazy(() => import("./hospitallist")),
  },
];
