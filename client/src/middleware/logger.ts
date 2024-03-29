import { Context } from "../deps.ts";

export default async (ctx: Context, next: () => Promise<unknown>) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};
