const { Admin, validateAdmin, validatePassword } = require("../model/admin");
const {Product}=require("../model/product")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const functionUtil=require('../utilFunction/functionUtil');






exports.login = (req, res, next) => {
  Admin.findOne({ userName: req.body.userName })
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
            AdminId: user._id,
            token: jwt.sign({ AdminId: user._id }, "RANDOM_TOKEN_SECRET", {
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

  exports.addProduct = (req, res, next) => {
   const decoded=functionUtil.verifToken(req,res)
    if(req.fields.photo){

      var path=functionUtil.uploadPhoto(res,req.fields.photo)
    }


    Admin.findOne({ _id: decoded.AdminId })
      .then(user => {
        if (!user) {
          return res
            .status(401)
            .json({ status: 401, message: "User not found !" });
        }
      Product.findOne({name:req.fields.name}).then(product=>{
    
        if(!product){
          let newproduct=new Product({
            name:req.fields.name,
            description:req.fields.description?req.fields.description:null,
            price:req.fields.price,
            quantity:req.fields.quantity?req.fields.quantity:1,
            image:req.fields.image?img.uploadPhoto(req.fields.image):null,
            sexe:req.fields.sexe,
            category:req.fields.category,
            image:path
          })
          newproduct.save().then(()=>res.status(200).json({status:200,message:"product added"})).catch(erreur=>res.status(400).json({status:400,message:erreur.message}))
        }else{
          Product.findByIdAndUpdate({_id:product._id},{
            $set:{quantity:req.fields.quantity?product.quantity+req.fields.quantity:product.quantity+1}
          }).then(()=>{
       
            res.status(200).json({status:200,message:"product added"})
          }).catch(err=>res.status(403).json({status:403,message:err.message}))
        }
      }).catch(err=>res.status(405).json({status:405,message:err.message}))
      })
      .catch(error =>
        res.status(500).json({ status: 500, message: error.message })
      );
  };


  exports.editProduct=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)
    if(req.fields.photo){

     var path=functionUtil.uploadPhoto(res,req.fields.photo)
    }
    Admin.findOne({ _id: decoded.AdminId })
    .then(user => {
      if (!user) {
        return res
          .status(401)
          .json({ status: 401, message: "User not found !" });
      }
 
      Product.findById({_id:req.params.id}).then((product)=>{
        if(!product){
          res.status(400).json({status:400,message:"product not found"})
        }
        const newProduct={
          $set:{name:req.fields.name?req.fields.name:product.name,
            price:req.fields.price?req.fields.price:product.price,
            image:req.fields.photo?path:product.image,
            description:req.fields.description?req.fields.description:product.description,
            quantity:req.fields.quantity?req.fields.quantity:product.quantity,
            sexe:req.fields.sexe?req.fields.sexe:product.sexe,
            category:req.fields.category?req.fields.category:product.category
          }
        }
        Product.findOneAndUpdate({_id:product._id},newProduct).then(()=>{
          res.status(200).json({status:200,message:"product edited"})
        }).catch(error=>
        res.status(400).json({status:400,message:error.message}))

      }).catch(error=>
        res.status(400).json({status:400,message:error.message}))
    })
    .catch(error =>
      res.status(500).json({ status: 500, message: error.message })
    );
  }

  exports.getProductByCategory=(req,res,next)=>{
    Product.find().then((product)=>{
      
     console.log(product)
     res.status(200).json({status:200,product:product.filter((el)=>{
       return el.category===req.params.category
     })})
    }).catch(error=>res.status(400).json({status:400,message:error.message}))

  }