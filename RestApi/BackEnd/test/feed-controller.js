const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Post = require("../models/postModel");
const feedController = require("../controllers/feedController");

describe("Auth Controller - Login", function () {
    before(function(done){
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
    })
    it("Should add a created post to the posts of the creator", function (done) {
        const req = {
            body: { title: "Test", content: "Test Post" },
            file:{path:"abc"},
            userId:"6174608701815c325dd37028"
        };

        const res={}
       
    });

    it("Should send a response with a valid user status for an existing user", function (done) {
        
           
    });
    after(async function(done){
        await User.deleteMany({})
        await Post.deleteMany({})
    })
});
