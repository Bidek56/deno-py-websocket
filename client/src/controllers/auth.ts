import { Status, compare, makeJwt, Jose, Payload } from "../deps.ts";

export async function login(ctx: any) {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body = await ctx.request.body();
        const user = body?.value?.user;

        if (!user) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else if (await compare(body?.value?.pass, "$2y$10$.n0T8FCm17a8N6dLnxbRLejOBpdS05QKvW1rtrP.7DCpn1FBhKsDW")) {
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
                message: `Logged in with ${body?.value?.user}`,
                data: { accessToken: token },
            };
        } else {
            ctx.throw(Status.Unauthorized, "Wrong Password!");
        }

    } catch (error) {
		  console.log("catch:", error);
    }
}

export async function logout(ctx: any) {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body = await ctx.request.body();
        const token = body?.value?.token;

        console.log("Logout:", body)

        if (!token) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else {
            ctx.cookies.delete("server-token")
        }

    } catch (error) {
		  console.log("catch:", error);
    }
}

export async function token(ctx: any) {

    try {
        if (ctx.cookies.get("server-token")) {
            ctx.response.status = Status.OK;
            ctx.response.body = { 'token': ctx.cookies.get("server-token") };
            ctx.response.type = "json";
            return;
        } else {
            ctx.response.status = Status.OK;
            ctx.response.body = { 'error': 'server-token not found' };
            ctx.response.type = "json";
        }
    } catch (error) {
        console.log("catch:", error);
    }
}