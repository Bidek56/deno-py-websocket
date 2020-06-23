// Importing Modules
import {
    Application,
    Router,
    send,
    React,
    ReactDOMServer
  } from "./src/deps.ts";

import App from './src/App.tsx';
import Main from './src/Main.tsx'

const server = new Application();
const router = new Router();

// Adding a route for js code to use i the browser
const browserBundlePath = "/browser.js";

// js for client side React - the React components are stored as client side consts
const js =
  `import React from "https://dev.jspm.io/react@16.13.1";
   import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
   import ReactCookie from 'https://dev.jspm.io/react-cookie';

   const App = ${App};
   const Main = ${Main};
   ReactDOM.hydrate(React.createElement(App), document.getElementById('react-app'));`;


// the js code is loaded from a script tag
const html =
  `<html>
    <head> 
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/static/style.css" />
      <title>Deneact O.O</title>
      <script type="module" src="${browserBundlePath}"></script>
    </head>
    <body>
      <div id="react-app">${(ReactDOMServer as any).renderToString(<App />)}</div>
    </body>
  </html>`;


// setting the routes
router.get(browserBundlePath, (ctx) => { //the js code that is loaded from script tag
  ctx.response.type ="application/javascript"
  ctx.response.body = js;
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
})
.get("/static/:name", async (ctx) => {
  // console.log(`Static router: ${ctx.request.method} ${ctx.request.url} ${ctx.params.name}`);
  ctx.response.type = "text/css"
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    extensions: [".css"],
    format: true
  });

})
.get("/", (ctx) => { //default route
  ctx.response.type = "text/html";
  ctx.response.body = html;
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
})

// Passing Router as middleware
server.use(router.routes());
server.use(router.allowedMethods());

// start server
console.log("React SSR App listening on port 8000");
await server.listen({ port: 8000 });