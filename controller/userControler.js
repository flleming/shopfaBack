const { User, validateUser, validatePassword } = require("../model/user");
const {Product}=require("../model/product")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




exports.login = (req, res, next) => {
    User.findOne({$or:[{ userName: req.fields.userName },{email:req.fields.email}]})
      .then(user => {

        if (!user) {
          return res
            .status(401)
            .json({ status: 401, message: "User not found !" });
        }
        bcrypt
          .compare(req.fields.password, user.password)
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
    const { error } = validateUser(req.fields);
    if (error) {
      return res
        .status(400)
        .send({ status: 400, message: error.details[0].message });
    }
  
    let userExist = await User.findOne({$or:[{ userName: req.fields.userName },{email:req.fields.email}]});
    if (userExist) {
      return res
        .status(400)
        .send({ status: 400, message: "this user is already in exit!" });
    }
   
    bcrypt
      .hash(req.fields.password, 10)
      .then(hash => {
        const user = new User({
          userName: req.fields.userName,
          password: hash,
          email:req.fields.email
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

  exports.getProductByCategory=(req,res,next)=>{

    Product.find().then((product)=>{
      let productCategory=product.filter((el)=>{
        return el.category===req.query.category
      })
      let productPaginer=productCategory.slice(parseInt(req.query.page)*parseInt(req.query.per_page)-parseInt(req.query.per_page),parseInt(req.query.page)*parseInt(req.query.per_page))
     console.log(product)
     res.status(200).json({status:200,product:productPaginer,nbrTotal:productCategory.length})
    }).catch(error=>res.status(400).json({status:400,message:error.message}))

  }

