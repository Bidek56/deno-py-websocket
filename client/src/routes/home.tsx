import { React, ReactDOMServer, Router, Status, send } from "../deps.ts";
import App from '../tsx/App.tsx'
import { NewTask, ScrollModal } from '../tsx/NewTask.tsx'
import NavBar from '../tsx/NavBar.tsx'
import Login from '../tsx/Login.tsx'

// Adding a route for js code to use i the browser
const browserBundlePath = "/browser.js";

// js for client side React - the React components are stored as client side consts
const js =
  `import React from "https://dev.jspm.io/react@16.13.1";
   import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";

   const App = ${App};
   const NewTask = ${NewTask}
   const NavBar = ${NavBar}
   const Login = ${Login}
   const ScrollModal = ${ScrollModal}
  
   ReactDOM.render(React.createElement(App), document.getElementById('react-app'));`;

// the js code is loaded from a script tag
const html =
  `<html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" data-react-helmet="true">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css" integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
      <link rel="stylesheet" href="/static/style.css" />
      <title>Deno ETL</title>
      <script type="module" src="${browserBundlePath}"></script>
    </head>
    <body>
      <div id="react-app">${ReactDOMServer.renderToString(<App />)}</div>
      <!-- Optional JavaScript -->
      <!-- Popper.js first, then Bootstrap JS -->
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>
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
