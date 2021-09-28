const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const adminRouter = require("./routes/adminRouter");
const shopRouter = require("./routes/shopRouter");
const errorController = require("./controllers/error");
const connectDatabase = require("./util/database");
const UserMongo = require("./models/userMongoModel");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(async (req, res, next) => {
    let user = await UserMongo.findById("614f7f49c32b18111e56af0f");
    res.cookie("user", user);
    next();
});
app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

connectDatabase.connect((client) => {
    // let user = new UserMongo("YasinV", "veliyev.yasin@gmail.com");
    // user.save();
    app.listen(3000);
});
