import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const ShareMessageConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/sharemessage",
    component: React.lazy(() => import("./sharemessage")),
  },
];
