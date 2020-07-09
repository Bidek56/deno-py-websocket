import { Router } from "../deps.ts";

import { login, logout, token } from "../controllers/auth.ts";

const router = new Router();

router.get("/auth/token", token)
      .post("/auth/login", login)
      .post("/auth/logout", logout);

export default router;
