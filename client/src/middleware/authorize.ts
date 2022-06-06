import { Status, Context, verify, Header, Payload } from "../deps.ts";
import { key } from "../../server.ts"

type JwtObject = { header: Header; payload?: Payload; signature: string }

export default async (ctx: Context, next: () => Promise<unknown>) => {
  const serverToken = await ctx?.cookies?.get("server-token")

  if (!serverToken) {
    if (ctx.throw)
      ctx.throw(Status.Unauthorized, "Access Token Missing!");
    else {
      // console.error("Access Token Missing!");
      await next();
    }
  } else {
    try {
      const jwtObject: Payload|null = await verify(serverToken, key);

      // console.log("jwtObject:",  jwtObject)
      // ctx.request.user = jwtObject?.payload;

      await next();
    } catch (err) {
      console.error("Authorize error:", err);
      if (ctx.throw)
        ctx.throw(Status.Unauthorized);
      else
        console.error(err);
    }
  }
};
