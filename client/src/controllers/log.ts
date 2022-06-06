import { Status, Context } from "../deps.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";

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

        if (body.type === "json") {
            value = await body?.value;
        }

        if (value && 'path' in value) {

            console.log("Deno.readFileSync:", value["path"]);

            // const res = await Deno.stat(value["path"]);
            // console.log(res);

            // if (existsSync(new URL(value["path"])) ) {

            //     const content = decoder.decode(Deno.readFileSync(value["path"]));

            //     // ctx.assert(!content, Status.BadRequest);
            //     ctx.response.body = { 'content': content };
            // } else {
            //     ctx.response.body = { 'error': "log does not exists"};
            // }

            ctx.response.status = Status.OK;
            ctx.response.type = "json";
            return;
        }
    } catch (error) {
        console.error("Err:", error);
        if (ctx.throw)
            ctx.throw(Status.InternalServerError, error);
        else
            console.error(error);            
    }
}