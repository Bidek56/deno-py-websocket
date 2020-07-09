import { Status, RouterContext, validateJwt, Jose, Payload } from "../deps.ts";

type JwtObject = { header: Jose; payload?: Payload; signature: string }

export default async (ctx: RouterContext, next: () => Promise<void>) => {
  const authHeader = ctx.request.headers.get("authorization");

  if (!authHeader) {
    ctx.throw(Status.Unauthorized, "Access Token Missing!");
  } else {
    const token = authHeader.split(" ")[1];

    try {
      const key: string = Deno.env.get("TOKEN_SECRET") ||
        "H3EgqdTJ1SqtOekMQXxwufbo2iPpu89O";

      const jwtObject: JwtObject|null = await validateJwt(token, key);

      // ctx.request.user = jwtObject?.payload;

      await next();
    } catch (err) {
      ctx.throw(Status.Unauthorized);
    }
  }
};
