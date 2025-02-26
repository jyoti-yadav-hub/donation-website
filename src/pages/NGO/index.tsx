import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const NGOListConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/ngo/:id?"],
    component: React.lazy(() => import("./ngolist")),
  },
  {
    path: "/ngo",
    component: () => {
      return <Redirect to="/ngo" />;
    },
  },
];

export const NGODetails = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/ngodetails",
    component: React.lazy(() => import("./ngodetails")),
  },
];

export const NGODonationConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/ngo-donation-list/:id?"],
    component: React.lazy(() => import("./ngo-donation-list")),
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: "/ngo-donation-list",
    component: React.lazy(() => import("./ngo-donation-list")),
  },
];

export const DeletedNGOConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/deleted-ngos/:id?"],
    component: React.lazy(() => import("./deleted-ngos")),
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: "/deleted-ngos",
    component: () => {
      return <Redirect to="/deleted-ngos" />;
    },
  },
];
