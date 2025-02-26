import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const FooterStripConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/footer-strip",
    component: React.lazy(() => import("./footer-strip")),
  },
];
