const { Admin, validateAdmin, validatePassword } = require("../model/admin");
const {Product}=require("../model/product")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const functionUtil=require('../utilFunction/functionUtil');
const { User } = require("../model/user");





exports.login = (req, res, next) => {
  Admin.findOne({ userName: req.fields.userName })
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

  exports.addProduct = (req, res, next) => {
   const decoded=functionUtil.verifToken(req,res)
    if(req.fields.photo){

      var path=functionUtil.uploadPhoto(res,req.fields.photo)
    }


    Admin.findOne({ _id: decoded.userId })
      .then(user => {
        if (!user) {
          return res
            .status(401)
            .json({ status: 401, message: "User not found !" });
        }
const carac={
  color:req.fields.color,
    size:req.fields.size,
    sexe:req.fields.sexe,
}
Product.findOne({caracterisque:carac,category:req.fields.category}).then((prod=>{
  if(!prod){
    let newproduct=new Product({
      name:req.fields.name,
      description:req.fields.description?req.fields.description:null,
      price:req.fields.price,
      image:req.fields.photo?path:null,
      caracterisque:carac,
      category:req.fields.category,
      quantity:req.fields.quantity,
    })
 
    newproduct.save().then(()=>res.status(200).json({status:200,message:"product added"})).catch(erreur=>res.status(400).json({status:400,message:erreur.message}))
  }else{
    Product.findOneAndUpdate({caracterisque:carac,category:req.fields.category},{$set:{ name:req.fields.name,
      description:req.fields.description?req.fields.description:null,
      price:req.fields.price,
      image:req.fields.photo?path:null,
      quantity:parseInt(req.fields.quantity)+parseInt(prod.quantity)}}).then(()=>{
        res.status(200).json({status:200,message:"product found and updated"})
      }).catch(err=>res.status(400).json({status:400,message:err.message}))
  }
}))
        
     
   
      
        
      }).catch(err=>res.status(405).json({status:405,message:err.message}))
    
     
  };


  exports.editProduct=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)
    if(req.fields.photo){

     var path=functionUtil.uploadPhoto(res,req.fields.photo)
    }
    Admin.findOne({ _id: decoded.userId })
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
        const carac={
          sexe:req.fields.sexe?req.fields.sexe:product.caracterisque.sexe,
          color:req.fields.color?req.fields.color:product.color,
          size:req.fields.size?req.fields.size:product.size
        }
        const newProduct={
          $set:{name:req.fields.name?req.fields.name:product.name,
            price:req.fields.price?req.fields.price:product.price,
            image:req.fields.photo?path:product.image,
            description:req.fields.description?req.fields.description:product.description,
            quantity:req.fields.quantity?req.fields.quantity:product.quantity,
            caracterisque:carac,
            category:req.fields.category?req.fields.category:product.category,
           
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

  

  exports.deleteProductbyId=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)
    Product.findByIdAndDelete({_id:req.params.id}).then(()=>{
      res.status(200).json({status:200,message:"Product was deleted"})
    }).catch(err=>res.status(400).json({status:400,message:err.message}))
  }
exports.getAllProduct=(req,res,next)=>{
  const decoded=functionUtil.verifToken(req,res)
  Product.find().then((product)=>{
    if(!product)res.status(400).json({status:400,message:"No product found"})
    if(!req.query.page)res.status(401).json({status:401,message:"page number"})
    if(!req.query.per_page)res.status(402).json({status:402,message:"per_page number"})
    res.status(200).json({status:200,product:product.slice(parseInt(req.query.page)*parseInt(req.query.per_page)-parseInt(req.query.per_page),parseInt(req.query.page)*parseInt(req.query.per_page)),nbreTotal:product.length})
  }).catch(err=>res.status(500).json({status:500,message:err.message}))
}

exports.getallUsers=(req,res,next)=>{
  const decoded=functionUtil.verifToken(req,res)
  User.find().then((user)=>{
    if(!user)res.status(400).jon({status:400,message:'No User found'})
    res.status(200).json({status:200,users:user.map((el)=>{
      return {userName:el.userName,email:el.email,userId:el._id}
    })})
  })
}
exports.deleteUserById=(req,res,next)=>{
  const decoded=functionUtil.verifToken(req,res)
  User.findByIdAndDelete({_id:req.params.id}).then(()=>{
    res.status(200).json({status:200,message:"User deleted!"})
  }).catch(err=>res.status(500).json({status:500,message:err.message}))
}

