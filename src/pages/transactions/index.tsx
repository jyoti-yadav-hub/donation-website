import React from "react";
import { Redirect } from "react-router-dom";
import { RoutePermittedRole } from "shared/constants/AppConst";

export const AdminDonationListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: ["/transactions/admin-donation-list/:id?"],
    component: React.lazy(() => import("./admin-donation-list")),
  },
  {
    path: "/transactions/admin-donation-list",
    component: () => {
      return <Redirect to="/transactions/admin-donation-list" />;
    },
  },
];

export const FeaturedListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/transactions/featured-list",
    component: React.lazy(() => import("./featured-list")),
  },
];

export const SaayamTransactionsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/transactions/saayam-transactions",
    component: React.lazy(() => import("./saayam-transactions")),
  },
];

export const DonationListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/transactions/donation-list",
    component: React.lazy(() => import("./donation-list")),
  },
];

export const TaxBenefitsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/transactions/taxbenefits",
    component: React.lazy(() => import("./taxbenefits")),
  },
];

export const PaymentGatewayConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: "/transactions/payment-gateway-list",
    component: React.lazy(() => import("./payment-gateway-list")),
  },
];
