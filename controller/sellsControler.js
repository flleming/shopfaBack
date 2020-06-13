const functionUtil=require('../utilFunction/functionUtil');
const {Sells, Achat}=require("../model/sells")
const {Admin}=require('../model/admin');
const { User } = require('../model/user');
const { Product } = require('../model/product');

exports.addSells=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)
    if(!decoded)res.status(400).json({status:400,message:"No user connected"})
        let products=[];
        if(typeof req.myFields.achat==="object"){
          products=req.myFields.achat       
        }else{
            products.push(req.myFields.achat)
        }
        let newSell=new Sells({
            user:decoded.userId,
            achat:products,
            totalPrice:req.fields.totalPrice
        })
       
        newSell.save().then(()=>{
            
                products.forEach((el)=>{
                    
                    Achat.findOne({_id:el}).populate('product').exec((err,products)=>{
                       console.log(products)
                        
                        if (err) {
                            return res
                              .status(404)
                              .json({ status: 404, message: "No productfound" });
                          }else if(products){
                             
                              Product.findOne({_id:products.product._id}).then((prof)=>{
                                Product.findOneAndUpdate({_id:prof._id},{
                                    $set:{quantity:prof.quantity-products.product.quantity}
                                  }).then(()=>{
                                      res.status(200).json({status:200,message:"sells added"})
                                  })
                              })
                             
                          }
                    })
                })
            
           
        }).catch(err=>res.status(400).json({status:400,message:err.message}))
   
   
}

exports.getSellsUsers=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)

    Sells.find({user:decoded.userId})
.populate('product').exec((err, sells) => {
            if (err) {
              return res
                .status(404)
                .json({ status: 404, message: "No productfound" });
            } else if (sells) {
                res.status(200).json({status:200,sells:sells})
            }
          })
       
    
}
exports.getAllSells=(req,res,nex)=>{
    const decoded=functionUtil.verifToken(req,res)
    Admin.findOne({_id:decoded.userId}).then((admin)=>{
        
        if(!admin)res.status(400).json({status:400,message:"admin not found"})
        let achats;
        Sells.find().populate('achat').populate('user').exec((err, sells) => {
            if (err) {
              return res
                .status(404)
                .json({ status: 404, message: "No productfound" });
            } else if (sells) {
                sells.achat.populate('product').exec((err,product)=>{
                    achats=product      
                })
                res.status(200).json({status:200,allsells:sells.map((el)=>{
                    return {product:achats,userName:el.user.userName,name:el.name,totalPrice:el.totalPrice,id:el._id}
                })})
            }
    }).catch(err=>res.status(500).json({status:500,message:err.message}))

  })

}
// exports.getBestSells=(req,res,next)=>{
//     const decoded=functionUtil.verifToken(req,res)
//     Sells.find().populate
// }

exports.addAchat=(req,res,next)=>{
    const decoded=functionUtil.verifToken(req,res)
    if(!decoded)res.status(400).json({status:400,message:"No user connected"})
    const newAchat=new Achat({
        product:req.fields.productId,
        quantity:req.fields.quantity
    })
    newAchat.save().then((acha)=>{
        res.status(200).json({status:200,achatId:acha._id,message:"achat added"})
    }).catch(err=>res.status(500).json({status:500,message:err.message}))
}
