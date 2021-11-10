import { Router } from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";
import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
    id?: string;
    text: string;
}
interface TodoSchema {
    _id: { $oid: string };
    text: string;
}
let todos: Todo[] = [];

router.get("/todos", async ctx => {
    const todos = await getDb().collection<TodoSchema>("todos").find().toArray();
    const transformedTodos = todos.map(todo => {
        return { id: todo._id.toString(), text: todo.text };
    });
    ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async ctx => {
    const data = await ctx.request.body();
    let { text } = await data.value;
    const newTodo: Todo = {
        text,
    };
    const id = await getDb().collection<TodoSchema>("todos").insertOne(newTodo);
    // console.log(id.toString());
    newTodo.id = id.toString();
    todos.push(newTodo);

    ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async ctx => {
    const tid = ctx.params.todoId;
    const data = await ctx.request.body();
    let { text } = await data.value;
    console.log(text);
    let k = await getDb()
        .collection("todos")
        .updateOne({ _id: new Bson.ObjectId(tid) }, { $set: { text: text } });
    ctx.response.body = { message: "Updated todo" };
});

router.delete("/todos/:todoId", async ctx => {
    const tid = ctx.params.todoId;
    await getDb()
        .collection("todos")
        .deleteOne({ _id: new Bson.ObjectId(tid) });
    ctx.response.body = { message: "Deleted todo" };
});

export default router;
