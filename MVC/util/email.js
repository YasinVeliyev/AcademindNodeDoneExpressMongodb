const nodemailer = require("nodemailer");
const { rawListeners } = require("../models/mongoose/userMongooseModel");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "karlee.willms19@ethereal.email",
        pass: "9CQVbuHAR7VKQcdd6J",
    },
});

exports.sendEmail = (req, res, to, token) => {
    let message = {
        from: "Nodemailer <example@nodemailer.com>",
        to,
        subject: "Reset Password",
        text: "For clients with plaintext support only",
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${req.protocol}://${req.headers.host}${req.originalUrl}/${token}">Reset Password</a> link to set a new password</p>
        `,
    };
    transporter.sendMail(message, (err, info) => {
        if (err) {
            req.flash("error", "Please try again");
        }
        res.redirect("/");
    });
};
