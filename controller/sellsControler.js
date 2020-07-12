const functionUtil = require('../utilFunction/functionUtil');
const { Sells, Achat } = require("../model/sells")
const { Admin } = require('../model/admin');
const { User } = require('../model/user');
const { Product } = require('../model/product');

exports.addSells = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)
    if (!decoded) res.status(400).json({ status: 400, message: "No user connected" })
    let products = [];
    if (typeof req.myFields.achat === "object") {
        products = req.myFields.achat
    } else {
        products.push(req.myFields.achat)
    }
    let newSell = new Sells({
        user: decoded.userId,
        achat: products,
        totalPrice: req.fields.totalPrice
    })

    newSell.save().then(() => {

        products.forEach((el) => {

            Achat.findOneAndUpdate({ _id: el }, { $set: { pending: false } }).populate('product').exec((err, products) => {

                if (err) {
                    return res
                        .status(404)
                        .json({ status: 404, message: "No productfound" });
                } else if (products) {

                    Product.findOne({ _id: products.product._id }).then((prof) => {
                        Product.findOneAndUpdate({ _id: prof._id }, {
                            $set: { quantity: parseInt(prof.quantity) - parseInt(products.product.quantity) }
                        }).then(() => {
                            res.status(200).json({ status: 200, message: "sells added" })
                        }).catch(err => res.status(400).json({ status: 400, message: err.message }))
                    })

                }
            })
        })


    }).catch(err => res.status(400).json({ status: 400, message: err.message }))


}

exports.getSellsUsers = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)

    Sells.find({ user: decoded.userId })
        .populate('product').exec((err, sells) => {
            if (err) {
                return res
                    .status(404)
                    .json({ status: 404, message: "No productfound" });
            } else if (sells) {
                res.status(200).json({ status: 200, sells: sells })
            }
        })


}
exports.getAllSells = (req, res, nex) => {
    const decoded = functionUtil.verifToken(req, res)
    Admin.findOne({ _id: decoded.userId }).then((admin) => {

        if (!admin) res.status(400).json({ status: 400, message: "admin not found" })
        let achats;
        Sells.find().populate('user').populate({ path: 'achat', populate: { path: 'product' } }).exec((err, sells) => {
            if (err) {
                return res
                    .status(404)
                    .json({ status: 404, message: "No productfound" });
            } else if (sells) {

           
                    res.status(200).json({
                        status: 200, allsells: sells.filter((el)=>{return el.user}).map((el) => {
                          
                            return { products: el.achat.map((object) => { return { quantity: object.quantity, product: object.product } }), userName: el.user.userName, totalPrice: el.totalPrice, id: el._id }
                        })
                    })
                

            }
        })

    })

}


exports.addAchat = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)
    if (!decoded) res.status(400).json({ status: 400, message: "No user connected" })
    Product.findOne({ _id: req.fields.productId }).then((prod) => {

        if (!prod) res.status(400).json({ status: 400, message: "product dont exist" })

        if (parseInt(prod.quantity) === 0) res.status(400).json({ status: 400, message: "product out of stock" })
        Achat.findOne({ product: req.fields.productId }).then((achat) => {
            if (achat) {
                
                Achat.findOneAndUpdate({ _id: achat._id }, { $set: { quantity: parseInt(req.fields.quantity) + parseInt(achat.quantity) } }).then(() => {
                    Product.findOneAndUpdate({ _id: req.fields.productId }, { $set: { quantity: parseInt(prod.quantity) - parseInt(req.fields.quantity) } }).then((prod) => {

                        res.status(200).json({ status: 200, achatId: achat._id, message: "achat added" })

                    }).catch(err => res.status(400).json({ status: 400, message: err.message }))
                }).catch(err => res.status(400).json({ status: 400, message: err.message }))
            } else {
                Product.findOneAndUpdate({ _id: req.fields.productId }, { $set: { quantity: parseInt(prod.quantity) - parseInt(req.fields.quantity) } }).then((prod) => {
                    console.log(req.fields)
                    const newAchat = new Achat({
                        product: req.fields.productId,
                        quantity: req.fields.quantity,
                        user: decoded.userId
                    })
                    newAchat.save().then((acha) => {
                        res.status(200).json({ status: 200, achatId: acha._id, message: "achat added" })
                    }).catch(err => res.status(500).json({ status: 500, message: err.message }))
                })
            }
        }).catch(err => res.status(400).json({ status: 400, message: err.message }))



    }).catch(err => res.status(500).json({ status: 500, message: err.message }))
}
exports.removeAchat=(req,res,next)=>{
    Achat.findByIdAndDelete({_id:req.id}).then((achat)=>{
        res.status(200).json({status:200,message:"Achat removed"})
    }).catch(err=>res.status(400).jsoon({status:400,message:err.message}))
}


exports.deleteAchatbyId = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)
    Achat.findByIdAndDelete({ _id: req.params.id }).then((achat) => {
        Product.findOne({ _id: achat.product }).then((prod) => {
            Product.findOneAndUpdate({ _id: req.fields.productId }, { $set: { quantity: parseInt(prod.quantity) + parseInt(req.fields.quantity) } }).then((prod) => {
                res.status(200).json({ status: 200, message: "achat was deleted" })
            }).catch(err => res.status(400).json({ status: 400, message: err.message }))
        }).catch(err => res.status(400).json({ status: 400, message: err.message }))

    }).catch(err => res.status(400).json({ status: 400, message: err.message }))
}

exports.getAchatbbyUser = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)
    Achat.find({ user: decoded.userId, pending: true }).populate('product').exec((err, achat) => {
        if (err) res.status(400).json({ status: 400, message: "no achat found" })
        if (achat) {
            res.status(200).json({ status: 200, achats: achat })
        }
    })
}
exports.deleteSellsById = (req, res, next) => {
    const decoded = functionUtil.verifToken(req, res)
    Sells.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res.status(200).json({ status: 200, message: "Sells deleted!" })
    }).catch(err => res.status(500).json({ status: 500, message: err.message }))
}

exports.getNewProduct = (req, res, next) => {
    Product.find().then((products) => {
        if (products.length < 9) {

            res.status(200).json({ status: 200, products: products.reverse() })
        }
        res.status(200).json({ status: 200, products: products.slice(products.length - 9, products.length).reverse() })
    }).catch(err=>res.status(400).json({status:400,message:err.message}))


}