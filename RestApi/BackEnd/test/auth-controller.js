const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const authController = require("../controllers/authController");

describe("Auth Controller - Login", function () {
    it("Should throw an error if accessing the database fails", function (done) {
        sinon.stub(User, "findOne");
        User.findOne.throws();
        const req = {
            body: { email: "veliyev.yasin@gmail.com", password: "123456" },
        };
        authController
            .login(req, {}, () => {})
            .then(result => {
                expect(result).to.be.an("error");
                expect(result).to.have.property("statusCode", 500);
                done();
            });
        User.findOne.restore();
    });

    it("Should send a response with a valid user status for an existing user", function (done) {
        mongoose
            .connect(
                "mongodb://localhost:27017/test-message?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
            )
            .then(result => {
                const user = new User({
                    email: "veliyev.yasin@gmail.com",
                    password: "123456",
                    name: "Test",
                    posts: [],
                    _id: "6174608701815c325dd37028",
                });
                return user.save();
            })
            .then(() => {
                const req = { userId: "6174608701815c325dd37028" };
                const res = {
                    statusCode:500,
                    userStatus=null,
                    status:function(code){
                        this.statusCode=code
                        return this
                    },
                    json:function(data){
                        this.userStatus=data.status

                    }
                }
               
            })
            .catch(err => console.error(err));
    });
});
