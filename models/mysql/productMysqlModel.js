const { mysqlConnector: db } = require("../../util/database");

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute("INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)", [
            this.title,
            this.price,
            this.imageUrl,
            this.description,
        ]);
    }

    static async fetchAll() {
        return await db.execute("SELECT * FROM products");
    }

    static findById(id) {
        return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
    }
};
