import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const PrivacyPolicyConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/privacy-policy",
    component: React.lazy(() => import("./privacy-policy")),
  },
];
