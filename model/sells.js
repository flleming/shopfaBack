const mongoose = require('mongoose');
const Joi = require('joi');

const achat=mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'

    },
    quantity:{
        type:Number,
        required:true
    }
})
const sellsSchema = mongoose.Schema({
    
    totalPrice: {
        type: Number,
        required: false
    },

    user: 
        {
            type: mongoose.Schema.Types.ObjectId,
           ref:"user"
        }
    ,
    achat:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref:'achat'
    }  
    ]
  
});


function validateSells(user) {
    const password = {
        name: Joi.string().min(5).max(255).required(),
       
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Sells = mongoose.model("sells", sellsSchema);
module.exports.Achat=mongoose.model('achat',achat)
module.exports.validateSells= validateSells;

