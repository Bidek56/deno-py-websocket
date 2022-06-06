
import {Application, ListenOptions, ListenOptionsTls, 
        Router, RouterContext, Context, Status, send, isHttpError, httpErrors} from 'https://deno.land/x/oak/mod.ts';

import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.62.0/testing/asserts.ts";

import {
  Server,
  ServerRequest,
} from "https://deno.land/x/oak/types.d.ts";


let addrStack: Array<string | ListenOptions> = [];
let serverRequestStack: ServerRequest[] = [];
let requestResponseStack = [];
let httpsOptionsStack: Array<Omit<ListenOptionsTls, "secure">> = [];

function teardown() {
  serverRequestStack = [];
  requestResponseStack = [];
  addrStack = [];
  httpsOptionsStack = [];
}

const serve = function (
  addr: string | ListenOptions,
) {
  addrStack.push(addr);
  return new MockServer() as Server;
};

class MockServer {
  close(): void {}

  async *[Symbol.asyncIterator]() {
    for await (const request of serverRequestStack) {
      yield request;
    }
  }
}

function createMockRequest(
  url = "/index.html",
  proto = "HTTP/1.1",
  headersInit: string[][] = [["host", "example.com"]],
): ServerRequest {
  return {
    url,
    headers: new Headers(headersInit),
    async respond(response) {
      requestResponseStack.push(response);
    },
    proto,
  } as any;
}


function createMockApp<S extends Record<string | number | symbol, any> = Record<string, any>,>(
  state = {} as S,
): Application<S> {
  const app = {
    state,
    use() {
      return app;
    },
  };
  return app as any;
}

function createMockContext<
  S extends Record<string | number | symbol, any> = Record<string, any>,
>(
  app: Application<S>,
  path = "/",
  method = "GET",
) {
  const headers = new Headers();
  return ({
    app,
    request: {
      headers: new Headers(),
      method,
      url: new URL(path, "https://localhost/"),
    },
    response: {
      status: undefined,
      body: undefined,
      redirect(url: string | URL) {
        headers.set("Location", encodeURI(String(url)));
      },
      headers,
    },
    state: app.state,
  } as unknown) as Context<S>;
}

function createMockNext() {
  return async function next() {};
}

function setup<S extends Record<string | number | symbol, any> = Record<string, any>,>(
  path = "/",
  method = "GET",
): {
  app: Application<S>;
  context: Context<S>;
  next: () => Promise<void>;
} {
  const app = createMockApp<S>();
  const context = createMockContext<S>(app, path, method);
  const next = createMockNext();
  return { app, context, next };
}


Deno.test({
  name: "construct App()",
  fn() {
    const app = new Application();
    assert(app instanceof Application);
  },
});

Deno.test({
  name: "register middleware",
  async fn() {
    serverRequestStack.push(createMockRequest());
    const app = new Application({ serve });
    let called = 0;
    app.use((context, next) => {
      assert(context instanceof Context);
      assertEquals(typeof next, "function");
      called++;
    });

    await app.listen(":8000");
    assertEquals(called, 1);
    teardown();
  },
});

Deno.test({
  name: "app.addEventListener()",
  async fn() {
    const app = new Application({ serve });
    app.addEventListener("error", (evt) => {
      assert(evt.error instanceof httpErrors.InternalServerError);
    });
    serverRequestStack.push(createMockRequest());
    app.use((ctx) => {
      ctx.throw(500, "oops!");
    });
    await app.listen({ port: 8000 });
    teardown();
  },
});

import error from "./src/middleware/error.ts";
import logger from "./src/middleware/logger.ts";
import timer from "./src/middleware/timer.ts";
import home from "./src/routes/home.tsx";

Deno.test({
  name: "app.listen",
  async fn() {
    const app = new Application({ serve });
    app.use(error);
    app.use(logger);
    app.use(timer);

    app.use(home.routes())

    await app.listen({ port: 8000 });
    assertEquals(addrStack, [{ port: 8000 }]);

    teardown();
  },
});

Deno.test({
  name: "router empty routes",
  async fn() {
    const { context, next } = setup();

    const router = new Router();
    const mw = router.routes();
    assertEquals(await mw(context, next), undefined);
  },
});

Deno.test({
  name: "home page",
  async fn() {
    const { app, context, next } = setup("/", "GET");

    const mw = home.routes();
    await mw(context, next);
    // console.log(context)

    assertEquals(context.response.status, Status.OK);
    assertEquals(context.response.type, "text/html");
  },
});

Deno.test({
  name: "/browser.js",
  async fn() {
    const { app, context, next } = setup("/browser.js", "GET");

    const mw = home.routes();
    await mw(context, next);
    // console.log(context)

    assertEquals(context.response.status, Status.OK);
    assertEquals(context.response.type, "application/javascript");
  },
});

import auth from "./src/routes/auth.ts";

Deno.test({
  name: "/auth/token",
  async fn() {
    const { app, context, next } = setup("/auth/token", "GET");

    const mw = auth.routes();
    await mw(context, next);
    // console.log(context)

    assertEquals(context.response.status, Status.OK);
    assertEquals(context.response.type, "json");
    assertEquals(context.response.body, { error: "server-token not found" });
  },
});

import log from "./src/routes/log.ts";

Deno.test({
  name: "/log",
  async fn() {
    const { app, context, next } = setup("/log", "POST");

    const mw = log.routes();
    await mw(context, next);
    // console.log(context)

    assertEquals(context.response.status, Status.OK);
    assertEquals(context.response.type, "json");
    assertEquals(context.response.body, { error: "Bad log request" });
  },
});
