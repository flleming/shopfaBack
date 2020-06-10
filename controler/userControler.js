const { User, validateUser, validatePassword } = require("../model/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




exports.login = (req, res, next) => {
    User.findOne({ userName: req.body.userName })
      .then(user => {
        if (!user) {
          return res
            .status(401)
            .json({ status: 401, message: "User not found !" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res
                .status(401)
                .json({ status: 401, message: "Wrong Password !" });
            }
            res.status(200).json({
              status: 200,
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "240h"
              }),
              name: user.userName
            });
          })
          .catch(error =>
            res.status(500).json({ status: 500, message: error.message })
          );
      })
      .catch(error =>
        res.status(500).json({ status: 500, message: error.message })
      );
  };

  async function signup(req, res, next) {
    //validate
    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .send({ status: 400, message: error.details[0].message });
    }
  
    let userExist = await User.findOne({ userName: req.body.userName });
    if (userExist) {
      return res
        .status(400)
        .send({ status: 400, message: "this user is already in exit!" });
    }
   
    bcrypt
      .hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          userName: req.body.userName,
          password: hash,
        });
  
        user
          .save()
          .then(() =>
            res.status(200).json({ status: 200, message: "user created!" })
          )
          .catch(error =>
            res.status(400).json({ status: 400, message: error.message })
          );
      })
      .catch(error =>
        res.status(500).json({ status: 500, message: error.message })
      );
  }
  
  exports.signup = signup;