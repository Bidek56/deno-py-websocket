import { Status } from "../deps.ts";

export async function token(ctx: any) {

    try {
        if (ctx.cookies.get("server-token")) {
            ctx.response.status = Status.OK;
            ctx.response.body = { 'token': ctx.cookies.get("server-token") };
            ctx.response.type = "json";
            return;
        } else {
            ctx.throw(Status.Unauthorized, "token not found!");
        }
    } catch (error) {
        console.log("catch:", error);
    }
}