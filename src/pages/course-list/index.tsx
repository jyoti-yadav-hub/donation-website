import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const CourseConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/course-list",
    component: React.lazy(() => import("./courselist")),
  },
];
