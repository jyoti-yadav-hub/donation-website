import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const usersConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/user/:id?", "/user/ngo/:id?"],
    component: React.lazy(() => import("./user")),
  },
  {
    path: "/user",
    component: () => {
      return <Redirect to="/user" />;
    },
  },
];

export const BlockedUserConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/blocked-users/:id?"],
    component: React.lazy(() => import("./blocked-users")),
  },
  {
    path: "/blocked-users",
    component: <Redirect to="/blocked-users" />,
  },
];
