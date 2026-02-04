const db = require("../models");
const User = db.user;

checkDuplicateNipOrEmail = (req, res, next) => {
  // Check NIP
  User.findOne({
    where: {
      nip: req.body.nip
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! NIP is already in use!"
      });
      return;
    }

    // Check Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateNipOrEmail: checkDuplicateNipOrEmail
};

module.exports = verifySignUp;
