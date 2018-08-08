const express = require('express');
const { Rentals, validateRental } = require('../models/rentalsModel');
const { Movies } =  require('../models/moviesModel');
const { Customers } =  require('../models/customersModel');
const auth = require('../middleware/auth');
var Fawn = require("fawn");
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const rentals = await Rentals.find().sort({dateOut: -1});
        res.send(rentals);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured please try again ${err.message}`);
        return false;
    }
});

router.get('/:id', async (req, res) => {
    try{
        const rental = await Rentals.findById(req.params.id);
        res.send(rental);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured please try again ${err.message}`);
        return false;
    }
    if(!rental){ 
        res.status(404).send("The rental with given ID is not found");
        return false;
    }
    
});

router.post('/', auth, async (req,res) => {
   // const result = validateRental(res.body);
    
    const { error } = validateRental(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return false;
    }
    try
    {
        const customer = await Customers.findById(req.body.customerId);
        if(!customer){
            res.status(400).send('Invalid customer');
            return false;
        }
        const movie = await Movies.findById(req.body.movieId);
        if(!movie){
            res.status(400).send('Invalid movie');
            return false;
        }
        if(movie.numberInStock === 0){
            res.status(400).send(' Movie not in stock'); return false;
        }
        let rental = new Rentals(
            { 
                customer:{ _id: customer.id, name: customer.name, phone: customer.phone},
                movie: { _id: movie.id, title: movie.title, dailyRentalRate: movie.dailyRentalRate}
            }
        );
        //rental = await rental.save();

       /* movie.numberInStock--; we have decrease the movie by 1 after sucessfull rental; 
        movie.save();*/
        try{
           /* new Fawn.Task()
            .save('rentals', rental)
            .update('movies',{_id: movie.id},{
            $inc: {numberInStock : -1}
        }).run(); */
            rental = await rental.save();
            movie.numberInStock--; //we have decrease the movie by 1 after sucessfull rental; 
            movie.save();
        }
        catch(err){
            res.status(500).send(`Something went wrong please try again later'+ ${err.message}`);
        }
        

        res.send(rental);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured please try again ${err.message}`);
        return false;
    }
});

router.put('/:id', auth, async (req,res)=>{
   //const result = validateRental(req.body);
    // result.error ie equvalent to { error }
    const { error } = validateRental(req.body); // object destructuring, here result.error can be assigned { error }
    if(error){
        res.status(400).send(error.details[0].message); //  invalid bad request
        return false;
    }
    try{ 
        const customer = await Customers.findById(req.body.customerId);
        if(!customer){
            res.status(400).send('Invalid customer');
            return false;
        }
        const movie = await Movies.findById(req.body.movieId);
        if(!movie){
            res.status(400).send('Invalid movie');
            return false;
        }
        const rental = await Rentals.findByIdAndUpdate(
            req.params.id,
            { 
                customer:{ _id: customer.id, name: customer.name, phone: customer.phone},
                movie: { _id: movie.id, title: movie.title, dailyRentalRate: movie.dailyRentalRate}
            },
            { new: true }
        );
        if(!rental){
            res.status(404).send("The rental with given ID is not found"); //  resource not found
            return false;
        }
        res.send(rental);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured while updating ${err.message}` );
        return false;
    }
}); 
router.delete('/:id',auth, async (req,res)=>{
    try{
        const rental = await Rentals.findByIdAndRemove(req.params.id);
        if(!rental){ res.status(404).send("The genre with given ID is not found");//  resource not found
            return false;
        }; 
        res.send(rental);
        return false;
    }
    catch(err){
        req.status(500).send(`Error occured while deleting + ${err.message}`);
        return false;
    } 
});

module.exports = router;