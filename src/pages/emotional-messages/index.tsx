import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const EmotionalConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/emotional-messages",
    component: React.lazy(() => import("./emotionalmessages")),
  },
];
