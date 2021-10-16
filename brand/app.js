const express = require("express");
const path = require("path");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/",(req,res,next)=>{
    res.sendFile(path.join(__dirname, "../", "views", "index.html"))
})

app.listen(3000);
