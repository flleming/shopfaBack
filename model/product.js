const mongoose = require('mongoose');
const Joi = require('joi');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    quantity:{
        type:Number,
        required:false,
        default:0,
    }
});


function validateProduct(user) {
    const password = {
      
        name: Joi.string().max(255).required(),
        price:Joi.number().required(),
        quantity:Joi.number().default(0)
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Product = mongoose.model("product", productSchema);
module.exports.validateProduct= validateProduct;

