import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface Todo {
    id: string;
    text: string;
}
let todos: Todo[] = [];

router.get("/todos", (ctx, next) => {
    ctx.response.body = { todos };
});

router.post("/todos", async (ctx, next) => {
    const data = await ctx.request.body();
    let { text } = await data.value;
    const newToDo: Todo = {
        id: new Date().toISOString(),
        text,
    };
    todos.push(newToDo);
    ctx.response.body = { message: "Created todo", todo: newToDo };
});
router.put("/todos/:todoId", async (ctx, next) => {
    const { todoId } = ctx.params;
    const data = await ctx.request.body();
    let { text } = await data.value;
    const todo = todos.filter(elem => elem.id === todoId);
    if (todo.length) {
        todo[0].text = text;
        return (ctx.response.body = { message: "Updated todo", todos });
    }

    return (ctx.response.body = { message: `Could not find todo for this id. ${todoId}` });
});
router.delete("/todos/:todoId", (ctx, next) => {
    const { todoId } = ctx.params;
    todos = todos.filter(elem => elem.id !== todoId);
    ctx.response.body = { message: "Deleted todo" };
});

export default router;
