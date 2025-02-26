import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const DiseaseConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/disease-list",
    component: React.lazy(() => import("./diseaselist")),
  },
];
