import { Status, create, getNumericDate, Header, Payload, Context } from "../deps.ts";
import { verify } from "https://deno.land/x/scrypt/mod.ts";
import { key } from "../../server.ts"

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

        if (!value || !user) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");

        // default pass is admin
        } else if (value?.pass && await verify(value?.pass, "c2NyeXB0AA4AAAAIAAAAAbd63Dy2cJ9Vh94KeJQCBGNjAKA+XpYYjiILNLiyN9MjurhuMClp1lf5XNHSbCCOToKySaocRQA0s/ZjZllJ+f/VI9WkxCrTarwRehJcrEMx")) {
            const header: Header = { alg: "HS512", typ: "JWT" };
            const payload: Payload = {
                id: user,
                name: user,
                exp: getNumericDate(36000)
            };

            const token = await create(header, payload, key);

            ctx.cookies.set("server-token", token, { httpOnly: true, maxAge: 36000 });

            ctx.response.body = {
                status: "success",
                message: `Logged in with ${value?.user}`,
                data: { accessToken: token },
            };
        } else {
            ctx.response.body = {
                status: "error",
                message: `Wrong password for ${value?.user}`
            };
        }

        ctx.response.status = Status.OK;
        ctx.response.type = "json";

    } catch (error) {
		console.log("catch:", error);
        ctx.throw(Status.Unauthorized, "Wrong Password!");
    }
}

export const logout = async(ctx: Context) => {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: any = await ctx.request.body();

        const value: {token: string} | undefined = await body?.value

        if (!value?.token) {
            ctx.throw(Status.UnprocessableEntity, "Token not found");
        } else {
            ctx.cookies.delete("server-token")
        }

        ctx.response.status = Status.OK;
        ctx.response.type = "json";
        ctx.response.body = {
            status: "success",
            message: `Logged out`
        };

    } catch (error) {
        console.log("catch:", error);
    }
}

export const token = async (ctx: Context) => {

    try {
        ctx.response.status = Status.OK;
        ctx.response.type = "json";
        if (await ctx?.cookies?.get("server-token")) {            
            ctx.response.body = { 'token': await ctx.cookies.get("server-token") };            
        } else {
            ctx.response.body = { 'error': 'server-token not found' };
        }
    } catch (error) {
        console.log("catch:", error);
    }
}