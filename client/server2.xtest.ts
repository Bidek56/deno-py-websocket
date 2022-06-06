import { assert, assertEquals, assertStrictEquals } from "https://deno.land/x/oak/test_deps.ts";

import {
  createMockApp,
  createMockContext,
  createMockNext,
  mockContextState,
} from "https://deno.land/x/oak/testing.ts";



Deno.test({
    name: "testing - createMockApp()",
    fn() {
      const app = createMockApp();
      assertEquals(app.state, {});
    },
  });

  import error from "./src/middleware/error.ts";
  import logger from "./src/middleware/logger.ts";
  import timer from "./src/middleware/timer.ts";
  import home from "./src/routes/home.tsx";
  
  Deno.test({
    name: "app.listen",
    async fn() {
      const app = createMockApp();
      app.use(error);
      app.use(logger);
      app.use(timer);
  
      app.use(home.routes())
  
      console.log("App:", app);

      // const serv = await app.listen({ port: 8000 });
      // console.log(serv);
      // assertEquals(addrStack, [{ port: 8000 }]);
      // teardown();
    },
  });