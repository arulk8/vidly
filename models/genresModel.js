const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema =  new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genres = mongoose.model('Genres',  genreSchema); // class

validateGenre = (genre) =>{
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = {
    Genres,
    validateGenre,
    genreSchema
}