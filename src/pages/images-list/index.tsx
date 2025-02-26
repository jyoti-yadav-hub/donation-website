import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const ImagesListsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/images-lists",
    component: React.lazy(() => import("./images-list")),
  },
];
