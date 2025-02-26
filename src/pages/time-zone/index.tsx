import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const TimeZoneConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/time-zone",
    component: React.lazy(() => import("./time-zone")),
  },
];
