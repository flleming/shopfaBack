const mongoose = require('mongoose');
const Joi = require('joi');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    price: 
        {
            type: Number,
           required:true
        }
    ,
   
    image:{
        type:String,
        required:false
    },
   
    category:{
        type:String,
        enum:["T-SHIRT","PANTS","WATCHES","GLASSES","SHOES"],
        required:true,
    
    },
    quantity:{
        type:Number,
        required:false,
        default:0,
    },
    caracterisque:{
       color:{
           type:String,required:true
       },
        size:{
            type:String,
            required:true
        },
        sexe:{
           type:String,
           enum:["MAN","WOMAN"],
           required:true
        },
    }
});


function validateProduct(user) {
    const password = {
      
        name: Joi.string().max(255).required(),
        price:Joi.number().required(),
       
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Product = mongoose.model("product", productSchema);
module.exports.validateProduct= validateProduct;

