import { Status, compare, makeJwt, Jose, Payload, RouterContext, Body } from "../deps.ts";

type LoginBody = Promise<any> & { user?: string, pass?: string }

export const login = async(ctx: RouterContext) => {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: Body = await ctx.request.body();
        
        let value: LoginBody;
        if (body?.type === 'json') {
            value = body?.value;
        } else {
            ctx.throw(Status.UnprocessableEntity, "Wrong body type");
        }

        const user = value?.user;

        if (!value || !user) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else if (value?.pass && await compare(value?.pass, "$2y$10$.n0T8FCm17a8N6dLnxbRLejOBpdS05QKvW1rtrP.7DCpn1FBhKsDW")) {
            const header: Jose = { alg: "HS256", typ: "JWT" };
            const payload: Payload = {
                id: user,
                name: user
            };
            const key: string = Deno.env.get("TOKEN_SECRET") || "H3EgqdTJ1SqtOekMQXxwufbo2iPpu89O";

            const token = makeJwt({ header, payload, key });

            ctx.cookies.set("server-token", token, { httpOnly: true, maxAge: 36000 });

            ctx.response.status = Status.OK;
            ctx.response.type = "json";
            ctx.response.body = {
                status: "success",
                message: `Logged in with ${value?.user}`,
                data: { accessToken: token },
            };
        } else {
            ctx.throw(Status.Unauthorized, "Wrong Password!");
        }

    } catch (error) {
		console.log("catch:", error);
    }
}

export async function logout(ctx: RouterContext) {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: any = await ctx.request.body();
        const token = body?.value?.token;

        if (!token) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else {
            ctx.cookies.delete("server-token")
        }

    } catch (error) {
        console.log("catch:", error);
    }
}

export const token = async (ctx: RouterContext) => {

    try {
        ctx.response.status = Status.OK;
        ctx.response.type = "json";
        if (ctx?.cookies?.get("server-token")) {            
            ctx.response.body = { 'token': ctx.cookies.get("server-token") };            
        } else {
            ctx.response.body = { 'error': 'server-token not found' };
        }
    } catch (error) {
        console.log("catch:", error);
    }
}