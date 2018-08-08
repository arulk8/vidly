const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema =  new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default : false
    }
});
userSchema.methods.generateAuthToken = function(){
    return jwt.sign({id : this._id, isAdmin : this.isAdmin }, config.get('jwtPrivateKey.value'));
}
const Users = mongoose.model('Users',  userSchema); // class

validateUser = (user) =>{
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

module.exports = {
    Users,
    validateUser
}