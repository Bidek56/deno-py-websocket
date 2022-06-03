import { Status, verify, create, Header, Payload, Context } from "../deps.ts";

type LoginBody = Promise<any> & { user?: string, pass?: string }

export const login = async(ctx: Context) => {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body = await ctx.request.body();
        
        let value: LoginBody | null = null;
        if (body?.type === 'json') {
            value = await body?.value;
        } else {
            ctx.throw(Status.UnprocessableEntity, "Wrong body type");
        }

        const user = await value?.user;

        const key = await crypto.subtle.generateKey(
            { name: "HMAC", hash: "SHA-512" },
            true,
            ["sign", "verify"],
          );

        console.log("Key:", key);

        if (!value || !user) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else if (value?.pass && await verify(value?.pass, key)) {
            const header: Header = { alg: "HS256", typ: "JWT" };
            const payload: Payload = {
                id: user,
                name: user
            };

            const token = await create(header, payload, key);

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

export async function logout(ctx: Context) {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: any = await ctx.request.body();
        const value: {token: string} | undefined = await body?.value

        if (!value.token) {
            ctx.throw(Status.UnprocessableEntity, "Token not found");
        } else {
            ctx.cookies.delete("server-token")
        }

    } catch (error) {
        console.log("catch:", error);
    }
}

export const token = async (ctx: Context) => {

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