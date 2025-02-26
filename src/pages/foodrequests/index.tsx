import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const foodrequestsConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/request-detail",
    component: React.lazy(() => import("./request-detail")),
  },
];
