import { Status, RouterContext } from "../deps.ts";

export const log = async (ctx: RouterContext) => {

    try {
        // console.log("Ctx:", ctx.request);
        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }
        const body = await ctx.request.body();

        let value: object | null = null;

        if (body.type === "json") {
            value = body?.value;
        }

        if (value && 'path' in value) {

            console.log("Deno.readFileSync:", value["path"])

            const content = decoder.decode(Deno.readFileSync(value["path"]));

            // ctx.assert(book.id && typeof book.id === "string", Status.BadRequest);
            ctx.response.status = Status.OK;
            ctx.response.body = { 'content': content };
            ctx.response.type = "json";
            return;
        }
    } catch (error) {
        ctx.throw(Status.InternalServerError, error);
    }
}