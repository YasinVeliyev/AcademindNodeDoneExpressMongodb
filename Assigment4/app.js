const express = require("express");

app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));

const users = ["Yasin"];

app.get("/", (req, res, next) => {
    res.render("index", { title: "Home Page" });
});

app.get("/users", (req, res, next) => {
    res.render("users", { users, title: "Users" });
});

app.post("/add-user", (req, res, next) => {
    users.push(req.body.name);
    res.redirect("/users");
});

app.listen(3000, () => console.info("Server is running"));
