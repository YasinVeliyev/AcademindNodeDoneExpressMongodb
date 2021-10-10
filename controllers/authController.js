const crypto = require("crypto");
const userSequelizeModel = require("../models/mysql/userSequelizeModel");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../util/email");
const { validationResult } = require("express-validator/check");

exports.getLogin = async (req, res, next) => {
    let messages = req.flash();
    await req.session.destroy();
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        messages,
        oldInput: { email: "", password: "" },
    });
};

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let messages = { danger: errors.array().map(msg => msg.msg) };
        return res.status(402).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            messages,
            oldInput: { email: req.body.email, password: req.body.password },
        });
    }
    let user = await userSequelizeModel.findOne({ where: { email: req.body.email } });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user.dataValues;
        req.session.isLoggedIn = true;
        return res.redirect("/");
    }
    req.flash("danger", "Invalid email or password");
    return res.redirect("/login");
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy(() => {
        return res.redirect("/login");
    });
};

exports.signup = async (req, res, next) => {
    let messages = req.flash();
    if (req.method == "GET") {
        return res.render("auth/signup", {
            path: "/signup",
            pageTitle: "SignUp",
            messages,
            oldInput: {},
        });
    }
    if (req.method == "POST") {
        const errors = validationResult(req);
        let { email, firstname, lastname, password, confirmpassword } = req.body;
        if (!errors.isEmpty()) {
            let messages = { danger: errors.array().map(msg => msg.msg) };
            console.log(messages);
            return res.status(402).render("auth/signup", {
                path: "/signup",
                pageTitle: "SignUp",
                messages,
                oldInput: { email, firstname, lastname, password, confirmpassword },
            });
        }

        try {
            const user = await userSequelizeModel.create({ email, firstname, lastname, password, confirmpassword });
            res.redirect("/login");
        } catch (err) {
            console.log(err.errors);
            req.flash("danger", err.errors[0].message);
            return res.redirect("/signup");
        }
    }
};

exports.getReset = (req, res, next) => {
    let messages = req.flash();
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        messages,
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.error(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        let user = await userSequelizeModel.findOne({ where: { email: req.body.email } });
        if (user) {
            req.session.user = user.dataValues;
            req.session.token = token;
            req.session.resetTokenExpiration = Date.now() + 180000;
            sendEmail(req, res, req.body.email, token);
            req.flash("info", "Reset email has been sent");
            res.redirect("/");
        } else {
            req.flash("danger", "No such user");
            res.redirect("/reset");
        }
    });
};

exports.getNewPassword = (req, res, next) => {
    let { token } = req.params;
    if (token === req.session.token && req.session.resetTokenExpiration >= Date.now()) {
        res.render("auth/recoverPassword.ejs", {
            path: "/new-password",
            pageTitle: "New Password",
            userId: req.session.user.id,
            messages: req.flash(),
        });
    } else {
        req.flash("danger", "Token is invalid or expired");
        res.redirect("/reset");
    }
};

exports.postNewPassword = async (req, res, next) => {
    const { password, confirmpassword, userId: id } = req.body;
    try {
        let user = await userSequelizeModel.update({ password, confirmpassword }, { where: { id } });
        if (user && req.session.resetTokenExpiration >= Date.now()) {
            req.flash("success", "Your password has been changed.Now You can login with your new password");
            res.redirect("/login");
        } else {
            req.flash("danger", "Token is invalid or expired");
            await req.session.destroy();
            res.redirect("/reset");
        }
    } catch (error) {
        console.log(error.errors);
        req.flash("danger", error.errors[0].message);
        res.redirect(`/reset/${req.session.token}`);
    }
};
