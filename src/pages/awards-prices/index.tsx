import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const AwardsPricesConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/awards-prices",
    component: React.lazy(() => import("./awards-prices")),
  },
];
