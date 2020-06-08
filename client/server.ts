import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

// const jobby = [
//   {
//     id: 1,
//     name: "Sirawich",
//     img:
//       "https://avatars2.githubusercontent.com/u/15623532?s=460&u=6cf89f72d64a2b2824876d64db256e1b870e478a&v=4",
//     job: "Semi Senior Full Stack Software Engineering/Scrum master",
//   },
//   {
//     id: 2,
//     name: "Kaiba",
//     img:
//       "https://vignette.wikia.nocookie.net/yugioh/images/d/dc/Seto_Kaiba.png/revision/latest?cb=20170131011725",
//     job: "Duel List",
//   },
// ];

// router
//   .get("/api/userjob", (ctx) => {
//     ctx.response.body = jobby;
//   })
//   .post("/api/userjob", (ctx) => {});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    index: "index.html",
  });
});

await app.listen({ port: 3000 });
