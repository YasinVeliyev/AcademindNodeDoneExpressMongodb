const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    let token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "somesupersecretsecret");
    } catch (err) {
        req.isAuth = false;
        next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        next();
    }
    req.userId = decodedToken.userId;
    req.status = decodedToken.status;
    req.isAuth = true;
    next();
};
