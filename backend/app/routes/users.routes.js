const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");
const { check, validationResult } = require("express-validator");
const validateCheck = require("../middleware/validate");

const express = require("express");
var multer = require("multer");
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
var upload = multer({ storage: storage });
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, PUT, OPTIONS"
    );
    next();
  });

  app.post("/api/signup", upload.single("profile-file"), controller.signup);

  app.post(
    "/api/login",
    [
      check("email").not().isEmpty().withMessage("email is required."),
      check("password").not().isEmpty().withMessage("password is required."),
    ],
    validateCheck.validate,
    controller.login
  );

  app.post(
    "/api/forgotpassword",
    [check("email").not().isEmpty().withMessage("email is required.")],
    validateCheck.validate,
    controller.forgotpassword
  );

 };
