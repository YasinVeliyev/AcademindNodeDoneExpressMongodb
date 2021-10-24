const fs = require("fs");
const path = require("path");
const Cart = require("./cartModel");
const p = path.join(
    path.dirname(require.main.filename),
    "data",
    "products.json"
);

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        fs.readFile(p, "utf-8", (err, data) => {
            let products = [];
            if (err) {
                console.error(err);
            } else {
                products = JSON.parse(data);
                this.id = ++products[0].id;
                products.push(this);
            }
            fs.writeFile(p, JSON.stringify(products), (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.log(data);
            });
        });
    }

    static findAndUpdate(product) {
        fs.readFile(p, "utf-8", (err, data) => {
            let products = [];
            if (err) {
                console.error(err);
            } else {
                products = JSON.parse(data);
                let index = products.findIndex((elem) => elem.id == product.id);
                if (index != -1) {
                    product.id = +product.id;
                    products[index] = product;
                }
            }
            fs.writeFile(p, JSON.stringify(products), (err, data) => {
                if (err) {
                    console.error(err);
                }
                //     console.log(data);
            });
        });
    }

    static findAndDelete(id) {
        fs.readFile(p, "utf-8", (err, data) => {
            let products = [];
            if (err) {
                console.error(err);
            } else {
                products = JSON.parse(data);
                let index = products.findIndex((elem) => elem.id == id);
                if (index != -1) {
                    Cart.findAndDelete(id, products[index].price);
                    products.splice(index, 1);
                }
            }
            fs.writeFile(p, JSON.stringify(products), (err, data) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    }

    static async fetchAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    return [];
                }
                resolve(JSON.parse(data).splice(1));
            });
        });
    }

    static async findById(id) {
        const products = await this.fetchAll();
        return products.find((product) => product.id == id);
    }
};
