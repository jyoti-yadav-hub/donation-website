import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const RequestAcceptConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/request-accept-form",
    component: React.lazy(() => import("./volunteers-form")),
  },
];

export const RequestRejectConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/request-reject-form",
    component: React.lazy(() => import("./volunteers-form")),
  },
];
