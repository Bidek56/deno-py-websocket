import { Status, Context } from "../deps.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

export const log = async (ctx: Context) => {

    const decoder = new TextDecoder("utf-8")

    try {
        if (!ctx.request.hasBody) {
            if (ctx.throw)
                ctx.throw(Status.BadRequest, "Bad request");
            else {
                ctx.response.status = Status.OK;
                ctx.response.body = { 'error': "Bad log request" };
                ctx.response.type = "json";
                return
            }
        }
        const body = await ctx.request.body();

        let value: {
            [key: string]: URL | string,
           } | null = null;

        ctx.response.status = Status.OK;
        ctx.response.type = "json";

        if (body.type === "json") {
            value = await body?.value;
        }

        if (existsSync(value?.path?.toString()) ) {

            const content = decoder.decode(Deno.readFileSync(value["path"]));

            if (content) {
                ctx.response.body = { 'content': content };
            } else {
                ctx.response.body = { 'error': "log content is empty"};
            }
        } else {
            ctx.response.body = { 'error': "log does not exists"};
        }

    } catch (error) {
        console.error("Log error:", error);
        if (ctx.throw)
            ctx.throw(Status.InternalServerError, error);
        else
            console.error(error);            
    }
}