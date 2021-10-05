const userSequelizeModel = require("../models/mysql/userSequelizeModel");
const bcrypt = require("bcryptjs");

exports.getLogin = async (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
    });
};

exports.postLogin = async (req, res, next) => {
    let user = await userSequelizeModel.findOne({ where: { email: req.body.email } });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user.dataValues;
        req.session.isLoggedIn = true;
        return res.redirect("/");
    }
    return res.redirect("/login");
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy(() => {
        return res.redirect("/login");
    });
};

exports.signup = async (req, res, next) => {
    if (req.method == "GET") {
        return res.render("auth/signup", { path: "/signup", pageTitle: "SignUp" });
    }
    if (req.method == "POST") {
        let { email, firstname, lastname, password, confirmpassword } = req.body;
        try {
            const user = await userSequelizeModel.create({ email, firstname, lastname, password, confirmpassword });
            res.redirect("/login");
        } catch (err) {
            return res.render("auth/signup", { path: "/signup", pageTitle: "SignUp", error: err });
        }
    }
};
