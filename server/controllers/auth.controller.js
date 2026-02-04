const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    nip: req.body.nip,
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role ? req.body.role : 'employee'
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      console.error("Signup Error:", err);
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  console.log("Signin request for NIP:", req.body.nip);
  User.findOne({
    where: {
      nip: req.body.nip
    }
  })
    .then(user => {
      if (!user) {
        console.log("User not found for NIP:", req.body.nip);
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        console.log("Invalid password for NIP:", req.body.nip);
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      res.status(200).send({
        id: user.id,
        nip: user.nip,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      console.error("Signin Error:", err);
      res.status(500).send({ message: "Internal Server Error: " + err.message });
    });
};
