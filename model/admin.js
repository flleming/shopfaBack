const mongoose = require('mongoose');
const Joi = require('joi');


const adminSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
  

    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    
   
   product:[
      { 
           type:mongoose.Schema.Types.ObjectId,
           ref:'product'
       }
   ]
});


function validateAdmin(user) {
    const password = {
        password: Joi.string().min(5).max(255).required(),
        userName: Joi.string().max(255).required(),
    };
    return Joi.validate(user, password, { abortEarly: false });
}


module.exports.Admin = mongoose.model("admin", adminSchema);
module.exports.validateAdmin = validateAdmin;

