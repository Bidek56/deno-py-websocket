// server.test.ts
import { superoak } from "https://deno.land/x/superoak@2.1.0/mod.ts";
import { app } from "./server.ts";


/**
 * Test that the server returns 200
 * GET request to "/".
 */
Deno.test("it should return status code 200", async () => {
    const request = await superoak(app);
    await request.get("/").expect(200);
});

Deno.test("it should return status code 200", async () => {
    const request = await superoak(app);
    await request.get("/browser.js").expect(200);
});

Deno.test("it should return status code 200", async () => {
    const request = await superoak(app);
    await request.get("/auth/token").expect(200)
            .expect('{"token":{}}');
});

Deno.test("it should return status code 401", async () => {
    const request = await superoak(app);
    await request.post("/log").expect(401)
});