const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('../models/genresModel');
const movieSchema =  new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre:{
        type: genreSchema,
        required: true,
    },
    numberInStock:{
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Movies = mongoose.model('Movies', movieSchema); // class

validateMovie = (movie) =>{
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema);
}

module.exports = {
    Movies,
    validateMovie
}