const userSequelizeModel = require("../models/mysql/userSequelizeModel");

exports.getLogin = async (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
    });
};

exports.postLogin = async (req, res, next) => {
    let user = await userSequelizeModel.findByPk(1);
    user.createCart();
    req.session.user = user;
    req.session.isLoggedIn = true;
    res.redirect("/");
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy(() => {
        return res.redirect("/");
    });
};
