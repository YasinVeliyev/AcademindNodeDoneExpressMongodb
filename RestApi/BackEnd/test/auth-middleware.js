const authMiddleware = require("../middleware/isAuthenticated");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

describe("Auth middleware", function () {
    it("Should throw an error if no authorization header is present", function () {
        const req = {
            get: function (header) {
                return null;
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => console.log("Test"))).to.throw("Not authenticated");
    });

    it("Should throw an error if authorization header is only one string", function () {
        const req = {
            get: function (header) {
                return "xys";
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => console.log("Test"))).to.throw();
    });

    it("Should throw an error if the token cannot be verified", function () {
        const req = {
            get: function (header) {
                return "Bearer xyz";
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => console.log("Test"))).to.throw();
    });

    it("Should yield a userId after decoding the token", function () {
        let token = jwt.sign({ userId: 1 }, "somesupersecretsecret", {
            expiresIn: "2h",
        });
        const req = {
            get: function (header) {
                return `Bearer ${token}`;
            },
        };

        authMiddleware(req, {}, () => {});
        expect(req).to.have.property("userId");
    });

    it("Should throw an error if the token cannot be verified", function () {
        const req = {
            get: function (header) {
                return "Bearer xyz";
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => console.log("Test"))).to.throw();
    });
});
