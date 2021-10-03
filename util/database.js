const mongodb = require("mongodb");
const MongoDbClient = mongodb.MongoClient;
const Sequelize = require("sequelize");
const mysql = require("mysql2");
const ProductMongo = require("../models/mongodb/productMongoModel");
const CartMongo = require("../models/mongodb/cartMongoModel");

let _db;

exports.connect = (calback) => {
    MongoDbClient.connect("mongodb://localhost:27017/shop")
        .then((client) => {
            _db = client.db();
            calback(client);
        })
        .catch((err) => console.error(err));
};

exports.getDb = () => {
    if (_db) {
        return _db;
    }
    throw new Error("No database found");
};

exports.ProductsInChart = async function (userId) {
    let carts = await CartMongo.fetchAll(userId);
    let products;
    let totalPrice = 0;
    if (carts) {
        products = await Promise.all(
            carts.products.map(async (prod, index) => {
                let product = await ProductMongo.findById(prod.productId);
                product.id = index + 1;
                product.qty = prod.qty;
                totalPrice += prod.qty * product.price;
                return product;
            })
        );
    } else {
        products = [];
    }
    return { products, totalPrice };
};

exports.sequelize = new Sequelize("node-complete", "root", "-", {
    dialect: "mysql",
    host: "localhost",
});

exports.mysqlConnector = mysql
    .createPool({
        host: "localhost",
        user: "root",
        database: "node-complete",
        password: "Python321-",
    })
    .promise();
