import { React, ReactDOMServer, Router, Status, send } from "../deps.ts";
import App from '../tsx/App.tsx'
import { NewTask, ScrollModal } from '../tsx/NewTask.tsx'
import NavBar from '../tsx/NavBar.tsx'
import Login from '../tsx/Login.tsx'

// Adding a route for js code to use i the browser
const browserBundlePath = "/browser.js";

// js for client side React - the React components are stored as client side consts
const js = 
  `import React from "https://cdn.skypack.dev/react";
   import ReactDOM from "https://cdn.skypack.dev/react-dom/server";

   const App = ${App};
   const NewTask = ${NewTask}
   const NavBar = ${NavBar}
   const Login = ${Login}
   const ScrollModal = ${ScrollModal}

   ReactDOM.hydrate(React.createElement(App), document.getElementById('react-app'));`;

// the js code is loaded from a script tag
const html =
  `<html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" data-react-helmet="true">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
      <link rel="stylesheet" href="/static/style.css" />
      <title>Deno ETL</title>
      <script type="module" src="${browserBundlePath}"></script>
    </head>
    <body>
      <div id="react-app">${ReactDOMServer.renderToString(<App />)}</div>
      <!-- Optional JavaScript -->
      <!-- JavaScript Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
    </body>
  </html>`;


const router = new Router();

router
.get("/static/:name", async (ctx) => {
  // console.log(`Static router: ${ctx.request.method} ${ctx.request.url} ${ctx.params.name}`);
  ctx.response.type = "text/css"
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    extensions: [".css"],
    format: true
  });
})
.get("/", (ctx) => {
  ctx.response.type = "text/html";
  ctx.response.body = html;
  ctx.response.status = Status.OK;
})
.get(browserBundlePath, (ctx) => { //the js code that is loaded from script tag
  ctx.response.type ="application/javascript"
  ctx.response.body = js;
  ctx.response.status = Status.OK;
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
});

export default router;
