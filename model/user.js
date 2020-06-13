const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: false
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
  

});


function validateUser(user) {
    const password = {
        password: Joi.string().min(5).max(255).required(),
        userName: Joi.string().max(255).required(),
        email:Joi.string().email().required()
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.User = mongoose.model("user", userSchema);
module.exports.validateUser = validateUser;

