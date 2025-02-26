import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const ManageCountryCurrencyConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/manage-country-currency",
    component: React.lazy(() => import("./manage-country-currency")),
  },
];
