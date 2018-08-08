const {Users} = require('../models/usersModel');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');


const router = express.Router();

router.post('/' , async (req, res) => {
    const { error } = validateUser(req.body);
    if(error){
        res.status(400).send(error.details[0].message);// bad request
        return false;
    }
    try{
        let user = await Users.findOne({email: req.body.email});
        if (!user){
            res.status(400).send("Invalid username or Password");
            return false;
        }
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if ( validatePassword ){
            const token = user.generateAuthToken();
            res.header('x-auth-token', token).send({id : user._id, name: user.name, email: user.email});
            return false;
        }
        res.send("Please enter a valid password");
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
});

validateUser = (user) =>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}
module.exports = router;