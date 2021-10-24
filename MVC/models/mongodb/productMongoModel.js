const connectDatabase = require("../../util/database");
const ObjectID = require("mongodb").ObjectID;
const UserMongo = require("./userMongoModel");

class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        let db = connectDatabase.getDb();
        return db
            .collection("products")
            .insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }
    static fetchAll() {
        let db = connectDatabase.getDb();
        return db
            .collection("products")
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.error(err));
    }

    static async findById(prodId) {
        const product = await connectDatabase
            .getDb()
            .collection("products")
            .findOne({ _id: new ObjectID(prodId) });
        return product;
    }

    static async findAndUpdate(prodId, update) {
        const product = await connectDatabase
            .getDb()
            .collection("products")
            .findOneAndUpdate({ _id: new ObjectID(prodId) }, { $set: update });

        return product;
    }

    static async findAndDelete(prodId) {
        const product = await connectDatabase
            .getDb()
            .collection("products")
            .findOneAndDelete({ _id: new ObjectID(prodId) });
    }
}
module.exports = Product;
