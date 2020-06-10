const mongoose = require('mongoose');
const Joi = require('joi');


const sellsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
    product:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
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
module.exports.validateSells= validateSells;

