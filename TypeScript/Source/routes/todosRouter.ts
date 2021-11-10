import { Router } from "express";

import { Todo } from "../models/todo";

const router = Router();

let todos: Array<Todo> = [{ id: "2021-11-07T19:13:41.144Z", text: "Hello World" }];

router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
    const newTodo: Todo = { id: new Date().toISOString(), text: req.body.text };
    todos.push(newTodo);
    res.status(201).json({ message: "Added Todo", todo: newTodo, todos });
});

router.put("/todo/:todoid", (req, res, next) => {
    const { todoid } = req.params;
    const todo = todos.filter(elem => elem.id === todoid);
    if (todo.length) {
        todo[0].text = req.body.text;
        return res.status(200).json({ message: "Updated todo", todos });
    }

    return res.status(404).json({ message: `Could not find todo for this id. ${todoid}` });
});

router.delete("/todo/:todoid", (req, res, next) => {
    const { todoid } = req.params;
    let todosLength = todos.length;
    todos = todos.filter(elem => elem.id !== todoid);
    if (todos.length < todosLength) {
        return res.status(200).json({ message: "Deleted todo", todos });
    }
    return res.status(404).json({ message: `Could not find todo for this id. ${todoid}` });
});

export default router;
