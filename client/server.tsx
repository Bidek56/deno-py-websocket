// Importing Modules
import { Application } from "./src/deps.ts";

import error from "./src/middleware/error.ts";
import logger from "./src/middleware/logger.ts";
import timer from "./src/middleware/timer.ts";
import home from "./src/routes/home.tsx";
import auth from "./src/routes/auth.ts";

const server = new Application();

server.use(error);
server.use(logger);
server.use(timer);

server.use(home.routes())
      .use(auth.routes());

server.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log("error:", evt.error);
});

// start server
console.log("React SSR App listening on port 8000");
await server.listen({ port: 8000 });