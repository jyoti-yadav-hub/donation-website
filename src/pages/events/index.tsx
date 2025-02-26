import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const EventsConfig = [
  {
    permittedRole: RoutePermittedRole.Admin,
    path: ["/events/:id?"],
    component: React.lazy(() => import("./events")),
  },
  {
    path: "/events",
    component: () => {
      return <Redirect to="/events" />;
    },
  },
  {
    permittedRole: RoutePermittedRole.Admin,
    path: "/events",
    component: React.lazy(() => import("./events")),
  },
];
