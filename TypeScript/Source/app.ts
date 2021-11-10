import express from "express";

import todosRouter from "./routes/todosRouter";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(todosRouter);

app.listen(3000, () => console.log("Server running"));
