// Importing Modules
import {
    Application,
    Router,
    RouterContext,
    Context,
    Status,
    send,
    React,
    ReactDOMServer
  } from "./src/deps.ts";

import App from './src/App.tsx';
import Main from './src/Main.tsx'
import NewTask from './src/NewTask.tsx'
import NavBar from './src/NavBar.tsx'
import Login from './src/Login.tsx'

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
   const NewTask = ${NewTask}
   const NavBar = ${NavBar}
   const Login = ${Login}

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
      <title>Deneact O.O</title>
      <script type="module" src="${browserBundlePath}"></script>
    </head>
    <body>
      <div id="react-app">${(ReactDOMServer as any).renderToString(<App />)}</div>
      <!-- Optional JavaScript -->
      <!-- Popper.js first, then Bootstrap JS -->
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>
    </body>
  </html>`;


function notFound(context: Context) {
  context.response.status = Status.NotFound;
  context.response.body = `<html><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
}

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
.post("/login", async (context: RouterContext) => {
  // console.log("Ctx:", context.request);
  if (!context.request.hasBody) {
    context.throw(Status.BadRequest, "Bad Request");
  }
  const body = await context.request.body();
  console.log("post login", body);

  let book: any;
  if (body.type === "json") {
      book = body.value;
    } else if (body.type === "form") {
      book = {};
      console.log("Book form")
    } else if (body.type === "form-data") {
      const formData = await body.value.read();
      book = formData.fields;
    }

    if (book) {
      // context.assert(book.id && typeof book.id === "string", Status.BadRequest);
      context.response.status = Status.OK;
      context.response.body = book;
      context.response.type = "json";
      return;
    }
})
.get("/", (ctx) => { //default route
  ctx.response.type = "text/html";
  ctx.response.body = html;
  // console.log("Cookie:",ctx.cookies)
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
})

// Passing Router as middleware
server.use(router.routes());
server.use(router.allowedMethods());

// A basic 404 page
server.use(notFound);

// start server
console.log("React SSR App listening on port 8000");
await server.listen({ port: 8000 });