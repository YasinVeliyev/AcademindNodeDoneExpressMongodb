const connectDatabase = require("../../util/database");
const ObjectID = require("mongodb").ObjectID;

class Cart {
    static async updateCart(userId, productId) {
        let db = connectDatabase.getDb();
        let userChart = await db.collection("cart").findOne({ userId: new ObjectID(userId) });

        if (userChart) {
            let product = userChart.products.find((product, index) => {
                if (product.productId == productId) {
                    userChart.products[index].qty++;
                    return product;
                }
            });

            if (!product) {
                userChart.products.push({
                    productId: new ObjectID(productId),
                    qty: 1,
                });
            }

            db.collection("cart").updateOne({ userId: new ObjectID(userId) }, { $set: userChart });
        } else {
            db.collection("cart").insertOne({
                userId: new ObjectID(userId),
                products: [{ productId: new ObjectID(productId), qty: 1 }],
            });
        }
    }

    static async fetchAll(userId) {
        let db = connectDatabase.getDb();
        return await db.collection("cart").findOne({ userId: new ObjectID(userId) });
    }

    static async findAndDelete(userId, productId) {
        let db = connectDatabase.getDb();
        let userChart = await db.collection("cart").findOne({ userId: new ObjectID(userId) });
        userChart.products = userChart.products.filter(chart => chart.productId != productId);

        db.collection("cart").updateMany(
            {
                userId: new ObjectID(userId),
            },
            { $set: userChart }
        );
    }

    static async addOrder(data) {
        let db = connectDatabase.getDb();
        // let [products, { totalPrice }] = prods;
        await db.collection("orders").insertOne(data);
        await db.collection("cart").deleteOne({ userId: data.user._id });
    }
}

module.exports = Cart;
