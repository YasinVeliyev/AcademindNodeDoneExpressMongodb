const connectDatabase = require("../util/database");
const ObjectID = require("mongodb").ObjectID;

class User {
    constructor(username, email) {
        this.username = username;
        this.emai = email;
    }

    async save() {
        const db = connectDatabase.getDb();
        await db.collection("users").insertOne(this);
    }

    static async findById(userId) {
        const db = connectDatabase.getDb();
        return await db.collection("users").findOne({ _id: ObjectID(userId) });
    }
}

module.exports = User;
