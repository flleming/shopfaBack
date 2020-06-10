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
  

});


function validateUser(user) {
    const password = {
        password: Joi.string().min(5).max(255).required(),
        userName: Joi.string().max(255).required(),
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.User = mongoose.model("user", userSchema);
module.exports.validateUser = validateUser;

