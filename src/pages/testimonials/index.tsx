import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const TestimonialsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/testimonials",
    component: React.lazy(() => import("./testimonials")),
  },
];
