import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const FundsListConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/funds/:id?", "/cancelled-funds/:id?"],
    component: React.lazy(() => import("./active-funds")),
  },
  {
    path: "funds",
    component: () => {
      return <Redirect to="active-funds" />;
    },
  },
];
