import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const DrivesListConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/drive-lists/:id?", "/cancelled-drive/:id?"],
    component: React.lazy(() => import("./drive-lists")),
  },
  {
    path: "drive-lists",
    component: () => {
      return <Redirect to="drive-lists" />;
    },
  },
];
