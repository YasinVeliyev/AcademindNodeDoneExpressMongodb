const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
require("dotenv").config();
const helmet = require("helmet");
const compress = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");

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
const store = new MongoDbStore({
    uri: "mongodb://localhost:27017/shop",
    collection: "sessions",
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg");
    {
        return cb(null, true);
    }
    cb(null, false);
};

const csrfProtection = csurf({ cookie: true });
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");
app.use(helmet());
app.use(compress());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(csrfProtection);
// sequelize.sync({ force: true });

app.use(async (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    let token = req.csrfToken();
    res.locals.csrfToken = token;
    res.cookie("XSRF-TOKEN", token);
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    console.log(`${req.protocol}://${req.headers.host}/checkout/success`);
    next();
});
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorController.get404);

connectDatabase.connect(() => {
    console.log("Mongodb");
});
// (async () => console.log(await productSequelizeModel.findAndCountAll({})))();

mongoose.connect("mongodb://localhost:27017/shop", err => {
    if (err) {
        console.error(err);
    } else {
        console.warn("Connected");

        // https.createServer({ key: privateKey, cert: certificate }, app).listen(3000);
        app.listen(3000);
    }
});
// app.listen(3000);
