const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const connection = require("../config/db");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      respone: false,
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    console.log(req.userId)
    next();
  });
};





const authJwt = {
  verifyToken: verifyToken,

};
module.exports = authJwt;