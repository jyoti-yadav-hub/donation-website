import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const CorporateReqAcceptConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/corporate-request-accept-form",
    component: React.lazy(() => import("./corporate-form")),
  },
];

export const CorporateReqRejectConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/corporate-request-reject-form",
    component: React.lazy(() => import("./corporate-form")),
  },
];
