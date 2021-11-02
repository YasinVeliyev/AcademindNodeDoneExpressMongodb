const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file");

const app = express();
app.use(helmet());
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg+xml"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(cors());
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

app.use(auth);
app.put("/post-image", (req, res, next) => {
    let filePath = req.file?.path || req.body.oldPath;
    if (!req.isAuth) {
        throw new Error("Not Authenticated");
    }
    if (!req.file && !req.body.oldPath) {
        throw new Error("No file provided");
    }
    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }

    return res.status(201).json({ message: "File stored", filePath });
});

app.use(
    "/graphql",
    (req, res, next) => {
        next();
    },
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            console.error(err);
            let {
                originalError: { data, code },
                message,
            } = err;
            message = err.message || "An error occured";
            return { message, data, code };
        },
    })
);

mongoose
    .connect("mongodb://localhost:27017/graphql?readPreference=primary&appname=MongoDB%20Compass&ssl=false")
    .then(() => {
        const server = app.listen(8080);
    })
    .catch(err => console.log(err));
