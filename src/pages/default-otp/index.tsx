import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const DefaultOtpConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/default-otp",
    component: React.lazy(() => import("./default-otp")),
  },
];
