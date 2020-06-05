import { serve } from "https://deno.land/std@v0.55.0/http/server.ts";

const serverTest = async () => {
  const st = serve({ port: 5000 });
  console.log("localhost:5000");
  for await (const req of st) {
    req.respond({ body: "Hello World\n" });
  }
};

serverTest();
