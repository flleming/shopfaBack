const mongoose = require('mongoose');
const Joi = require('joi');


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product:[
        {
            type:mongoose.Schema
        }
    ]
});


function validateCategory(user) {
    const password = {
       
        userName: Joi.string().max(255).required(),
    
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Category = mongoose.model("category", categorySchema);
module.exports.validateCategory= validateCategory;

