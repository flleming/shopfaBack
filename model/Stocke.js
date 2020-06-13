const mongoose = require('mongoose');
const Joi = require('joi');


const StockeSchema = mongoose.Schema({
  
   
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    } ,
    quantity:{
        type:Number,
        required:true
    }
    
});


function validateStocke(user) {
    const password = {
        quantity: Joi.Number().required(),
       
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Stocke = mongoose.model("stocke", StockeSchema);
module.exports.validateStocke= validateStocke;

