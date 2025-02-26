import React from "react";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const authRouteConfig = [
  {
    path: "/signin",
    component: React.lazy(() => import("./Signin/index")),
  },
  {
    path: "/signup",
    component: React.lazy(() => import("./Signup/index")),
  },
  {
    path: "/forget-password",
    component: React.lazy(() => import("./ForgetPassword")),
  },
  {
    path: "/confirm-signup",
    component: React.lazy(() => import("./ConfirmSignupAwsCognito")),
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/reset-password/:id?"], // ["/ngo/:id?"]
    component: React.lazy(() => import("./ResetPasswordAwsCognito")),
  },
];
