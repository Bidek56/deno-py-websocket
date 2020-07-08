import { Router } from "../deps.ts";

import { login } from "../controllers/auth.ts";
import { token } from "../controllers/token.ts"

const router = new Router();

router.get("/auth/token", token)
      .post("/auth/login", login);

export default router;
