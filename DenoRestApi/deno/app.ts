import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts";
connect();
const app = new Application();

app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    console.log("Middleware!");
    await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8001 });
