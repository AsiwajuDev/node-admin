import { Router } from "express";
import {
  AuthenticatedUser,
  Login,
  Logout,
  Register,
} from "./controller/auth.controller";
import { UpdateInfo, UpdatePassword } from "./controller/profile.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
  router.post("/api/register", Register);
  router.post("/api/login", Login);
  router.get("/api/user", AuthMiddleware, AuthenticatedUser);
  router.post("/api/logout", AuthMiddleware, Logout);
  router.put("/api/user/info", AuthMiddleware, UpdateInfo);
  router.put("/api/user/password", AuthMiddleware, UpdatePassword);
};
