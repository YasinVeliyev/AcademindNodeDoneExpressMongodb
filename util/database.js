const mongodb = require("mongodb");
const MongoDbClient = mongodb.MongoClient;

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
