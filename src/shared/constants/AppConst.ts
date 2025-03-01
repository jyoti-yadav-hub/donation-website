import { AuthUser } from "../../types/models/AuthUser";

export const authRole = {
  admin: ["admin"],
  user: ["user", "admin"],
};

export enum RoutePermittedRole {
  Admin = "admin",
  User = "user",
}

export const defaultUser: AuthUser = {
  uid: "john-alex",
  displayName: "John Alex",
  email: "demo@example.com",
  token: "access-token",
  role: "user",
  photoURL: "/assets/images/avatar/A11.jpg",
};

export const initialUrl = "/dashboard"; // this url will open after login

export const initialTimeFormat = "DD/MMM/YYYY h:mm A";
export const initialFormat = "DD/MMM/YYYY";
export const initialInputFormat = "dd/MMM/yyyy";
