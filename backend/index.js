const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var jwt = require("jsonwebtoken");
var multer  = require("multer");
const dotenv = require('dotenv');
dotenv.config();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const server = require('http').createServer(app);
var corsOptions = {
  origin: ["http://localhost:8081","http://localhost:4200"],
  }
const PORT = process.env.PORT || 3208;


app.use('/uploads', express.static('uploads'))
const db = require("./app/models");

db.sequelize.sync();

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });


app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
  });
 require('./app/routes')(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
