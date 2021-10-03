const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserMongooseModel = require("./models/mongoose/userMongooseModel");
const { sequelize } = require("./util/database");
const productSequelizeModel = require("./models/mysql/productSequelizeModel");
const userSequelizeModel = require("./models/mysql/userSequelizeModel");
const cartSequelizeModel = require("./models/mysql/cartSequelizeModel");
const cartItem = require("./models/mysql/cart-item");
const orderItem = require("./models/mysql/order-item");
const orderSequelizeModel = require("./models/mysql/orderSequelizeModel");

userSequelizeModel.hasOne(cartSequelizeModel);
cartSequelizeModel.belongsTo(userSequelizeModel);
cartSequelizeModel.belongsToMany(productSequelizeModel, { through: cartItem });
productSequelizeModel.belongsToMany(cartSequelizeModel, { through: cartItem });
orderSequelizeModel.belongsTo(userSequelizeModel);
userSequelizeModel.hasMany(orderSequelizeModel);
orderSequelizeModel.belongsToMany(productSequelizeModel, {
    through: orderItem,
});

const adminRouter = require("./routes/adminRouter");
const shopRouter = require("./routes/shopRouter");
const authRouter = require("./routes/authRouter");
const errorController = require("./controllers/error");
const connectDatabase = require("./util/database");
const UserMongo = require("./models/mongodb/userMongoModel");
const Cart = require("./models/json/cartModel");
const CartItem = require("./models/mysql/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// sequelize.sync();

app.use(async (req, res, next) => {
    let user = await userSequelizeModel.findByPk(1);
    // let user = await UserMongooseModel.findOne();
    user.createCart();
    req.user = user;
    next();
});
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorController.get404);

connectDatabase.connect(() => {
    console.log("Mongodb");
});

mongoose.connect("mongodb://localhost:27017/shop", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.warn("Connected");

        app.listen(3000);
    }
});
