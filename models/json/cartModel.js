const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let cart = JSON.parse(data);
                let updatedProduct = cart.products.find(
                    (product) => product.id == id
                );
                if (updatedProduct) {
                    updatedProduct.qty++;
                } else {
                    cart.products.push({ id, qty: 1 });
                }
                cart.totalPrice += productPrice;
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    static findAndDelete(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let cart = JSON.parse(data);
                let index = cart.products.findIndex((elem) => elem.id == id);
                if (index != -1) {
                    let qty = cart.products[index]["qty"];
                    let updatedProduct = cart.products.filter(
                        (product) => product.id != id
                    );
                    cart.totalPrice -= productPrice * qty;
                    cart.products = updatedProduct;
                }

                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    static async fetchAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    return [];
                }
                resolve(JSON.parse(data));
            });
        });
    }
};
