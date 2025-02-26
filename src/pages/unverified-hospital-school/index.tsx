import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const UnverifiedSchoolHospital = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/unverified-hospital-school",
    component: React.lazy(() => import("./unverified-hospital-school")),
  },
];
