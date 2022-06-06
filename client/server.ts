// Importing Modules
import { Application } from "./src/deps.ts";

import error from "./src/middleware/error.ts";
import logger from "./src/middleware/logger.ts";
import timer from "./src/middleware/timer.ts";
import home from "./src/routes/home.tsx";
import auth from "./src/routes/auth.ts";
import log from "./src/routes/log.ts";


// use the native Web Crypto APIto generate a secure CryptoKey.
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const app = new Application();

app.use(error);
app.use(logger);
app.use(timer);

app.use(home.routes())
    .use(auth.routes())
    .use(log.routes());

app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log("error:", evt.error);
});

if (import.meta.main) {
  // start server
  console.log("React SSR App listening on port 8000");
  await app.listen({ port: 8000 });
}

export { app, key };