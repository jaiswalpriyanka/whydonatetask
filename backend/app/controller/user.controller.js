const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const { user } = require("../models");
const apiresponse = require("../helpers/apiResponse");
const { where } = require("sequelize");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

exports.signup = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        if (!req.file) {
          var dataUser = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            status: 1,
            verification_status: "1",
            password: bcrypt.hashSync(req.body.password, 8),
            complete_profile: 0,
            device_token: req.body.device_token ? req.body.device_token : null
          };
        } else {
          var dataUser = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            status: 1,
            type: 2,
            verification_status: "1",
            password: bcrypt.hashSync(req.body.password, 8),
            is_register: "1",
            profile_image: req.file.path,
            complete_profile: 0,
            device_token: req.body.device_token ? req.body.device_token : null

          };
        }
        User.create(dataUser)
          .then((user) => {
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 604800, // 1 week
            });

            user["accessToken"] = token;

            User.update({ accessToken: token }, { where: { id: user.id } })
              .then((data) => { })
              .catch((err) => { });

            var from = "notification@yopmail.com";
            var to = req.body.email;
            var subject = "Welcome To Upflair";
            var name = req.body.first_name + " " + req.body.last_name;
            var html = NodeMailer.getHTMLMailBody(
              "email_template/welcome.html",
              name
            );
            NodeMailer.sendmail(from, to, subject, html);

            res.send({
              response: true,
              message: "User registered successfully!",
              data: user,
            });
          })
          .catch((err) => {
            res.status(500).send({ response: false, message: err.message });
          });
      } else {
        res.status(500).send({
          response: false,
          message: "Email id already exists",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ response: false, message: err.message });
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    },
  })
    .then(async (user) => {
      if (!user) {
        return res
          .status(404)
          .send({ data: {}, response: false, message: "User Not found." });
      }

      if (user.status == "0") {
        return res.status(401).send({
          response: false,
          message:
            "This account is not active. Please contact an administrator",
        });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          data: {},
          response: false,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604800, // 1 week
      });
      user["accessToken"] = token;
      if (user.status == 0) {
        return res.status(401).send({
          response: true,
          data: user,
          message: "Your Profile Is Inactive!",
        });
      }
      if (req.body.device_token) {
        await User.update({ device_token: req.body.device_token }, { where: { id: user.id } }).then(d => {
          console.log(d);
          user["device_token"] = req.body.device_token;
        })

      }
      User.update({ accessToken: token }, { where: { id: user.id } })
        .then((data) => { })
        .catch((err) => { });
      console.log("hiii");
      res.status(200).send({
        response: true,
        data: user,
        message: "Login Successfully",
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


exports.forgotpassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        apiresponse.notFoundResponse(res, "User not found");
      } else {
        var val = Math.floor(1000 + Math.random() * 9000);

        var from = "notification@yopmail.com";
        var to = req.body.email;
        var subject = "Forgot Password - Upflair";
        let files = "Your OTP is-" + val;
        NodeMailer.sendmail(from, to, subject, files);
        userotp.destroy({ where: { user_id: user.id } });
        var usotp = userotp
          .create({
            user_id: user.id,
            otp: val,
          })
          .then(
            (data) => { },
            (err) => { }
          );
        var dataOtp = {
          user_id: user.id,
          otp: val,
        };
        var msg = "A reset email has been sent to " + req.body.email;

        apiresponse.successResponseWithData(res, msg, dataOtp);
      }
    })
    .catch((err) => {
      apiresponse.ErrorResponse(res, err.message);
    });
};

exports.getUserDetails = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  }).then(
    (data) => {
      res.status(200).send({
        respone: true,
        message: "User Details fetched",
        data: data,
      });
    },
    (err) => {
      res.status(404).send({
        respone: false,
        err: err,
      });
    }
  );
};

exports.completeProfile = (req, res) => {
  User.update(
    {
      size: req.body.size,
      color: req.body.color,
      category: req.body.category,
      complete_profile: 0,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  ).then(
    (data) => {
      User.findOne({ where: { id: req.body.id } }).then(
        (result) => {
          apiresponse.successResponseWithData(
            res,
            "Profile updated successfully",
            result
          );
        },
        (err) => { }
      );
    },
    (err) => {
      apiresponse.ErrorResponse(res, "Something went wrong");
    }
  );
};

exports.addUserBrand = (req, res) => {
  var myJsonString = JSON.stringify(req.body.brand);
  User.update(
    {
      brand: myJsonString,
      complete_profile: 1,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  ).then(
    (data) => {
      User.findOne({ where: { id: req.body.id } }).then(
        (result) => {
          apiresponse.successResponseWithData(
            res,
            "Brand updated successfully",
            result
          );
        },
        (err) => { }
      );
    },
    (err) => {
      apiresponse.ErrorResponse(res, "Something went wrong");
    }
  );
};

exports.updateProfile = async (req, res) => {
  var test = await getUploadURL(req.file);

  if (!req.file) {
    var profileData = {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    User.update(profileData, {
      where: {
        id: req.userId,
      },
    }).then(
      (data) => {
        res.status(200).send({
          response: true,
          message: "Profile updated successfully",
        });
      },
      (err) => {
        res.status(400).send({
          response: false,
          message: "Something went wrong1",
        });
      }
    );
  } else {
    s3.upload(test, function (err, data) {
      if (err) {
        throw err;
      }

      var loc = data.Location;
      let profile_image = loc.replace(config.bucket_url, "");

      var profileData = {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        profile_image: profile_image,
      };

      User.update(profileData, {
        where: {
          id: req.userId,
        },
      }).then(
        (data) => {
          res.status(200).send({
            response: true,
            message: "Profile updated successfully",
          });
        },
        (err) => {
          res.status(400).send({
            response: false,
            message: "Something went wrong1",
          });
        }
      );
    });
  }
};

