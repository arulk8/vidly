const mongoose = require('mongoose');
const Joi = require('joi');
const { customerSchema } = require('./customersModel');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});
const rentalSchema = new mongoose.Schema({
    customer: { type: customerSchema, required: true },
    movie: { type: movieSchema, required: true},
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: {type: Date},
    rentalFee: {type: Number, min: 0 }
});

const Rentals = mongoose.model('Rentals', rentalSchema);
validateRental = (rental) =>{
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

module.exports = {
    Rentals,
    validateRental
}