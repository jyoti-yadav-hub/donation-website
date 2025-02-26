import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const ManageReqConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/manage-requests", "/manage-requests/:id?"],
    component: React.lazy(() => import("./manage-requests")),
  },
  {
    path: "/manage-requests",
    component: () => {
      return <Redirect to="/manage-requests" />;
    },
  },
];

export const CausesDetailConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/cause-details",
    component: React.lazy(() => import("./details")),
  },
];
