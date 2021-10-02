const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserMongooseModel = require("./models/mongoose/userMongooseModel");
const { sequelize } = require("./util/database");
// UserMongooseModel.create({
//     name: "Veliyev Yasin",
//     email: "veliyev.yasin@gmail.com",
//     cart: [],
// });

const adminRouter = require("./routes/adminRouter");
const shopRouter = require("./routes/shopRouter");
const errorController = require("./controllers/error");
const connectDatabase = require("./util/database");
const UserMongo = require("./models/mongodb/userMongoModel");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(async (req, res, next) => {
    let user = await UserMongooseModel.findOne();
    res.cookie("user", user);
    next();
});
app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

connectDatabase.connect(() => {
    console.log("Mongodb");
});

mongoose.connect("mongodb://localhost:27017/shop", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected");

        app.listen(3000);
    }
});
