let express = require("express");
let router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const User = require("../model/userModel");
const userModel = require("../model/userModel");
const { removeListener } = require("../model/userModel");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// get All users
router.get("/users", (req, resp) => {
  User.find({}, (err, data) => {
    if (err) throw err;
    resp.send(data);
  });
});

// register user
router.post("/register", (req, resp) => {
  let hashPassword = bcrypt.hashSync(req.body.password, 8);
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      phone: req.body.phone,
      role: req.body.role ? req.body.role : "User",
    },
    (err, data) => {
      if (err) resp.send("Error while registering");
      resp.send("Registration successfull");
    }
  );
});

//LoginUser
router.post("/login", (req, resp) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) resp.send({ auth: false, token: "Error while login" });
    if (!user) resp.send({ auth: false, token: "No User Found" });
    else {
      const passIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passIsValid) resp.send({ auth: false, token: "Invalid Password" });
      // incase both valid
      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400,
      }); // token available for 24 hours
      resp.send({ auth: true, token: token });
    }
  });
});

//UserInfo
router.get("/userInfo", (req, resp) => {
  let token = req.headers["x-access-token"];
  if (!token) resp.send({ auth: false, token: "No token Provided" });
  //jwt verify
  jwt.verify(token, config.secret, (err, user) => {
    if (err) resp.send({ auth: false, token: "Invalid token" });
    User.findById(user.id, (err, result) => {
      resp.send(result);
    });
  });
});

module.exports = router;
