import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const HelpRequestsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/help-requests/:id?"],
    component: React.lazy(() => import("./help-requests")),
  },
  {
    path: "/help-requests",
    component: () => {
      return <Redirect to="/help-requests" />;
    },
  },
];
