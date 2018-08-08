const express = require('express');
const { Customers, validateCustomer } = require('../models/customersModel');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const customers = await Customers.find().sort({name: 1});
        res.send(customers);
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
    
});
router.get('/:id', async (req, res) => {
    try{
        const customer = await Customers.findById(req.params.id);
        if(!customer){ 
            res.status(404).send("The customer with given ID is not found");
            return false;
        }
        res.send(customer);
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
    
});
router.post('/', auth, async (req,res) => {
   // const result = validateCustomer(res.body);
    const { error } = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return false;
    }
    try{
        let customer = new Customers(
            { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }
        );
        customer = await customer.save();
        res.send(customer);
        return false;
    }
    catch(error){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
});
router.put('/:id', auth, async (req,res)=>{
   //const result = validateCustomer(req.body);
    // result.error ie equvalent to { error }
    const { error } = validateCustomer(req.body); // object destructuring, here result.error can be assigned { error }
    if(error){
        res.status(400).send(error.details[0].message); //  invalid bad request
        return false;
    }
    try{
        const customer = await Customers.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold  },
            { new: true }
        );
        if(!customer){
            res.status(404).send("The customer with given ID is not found"); //  resource not found
            return false;
        }
        res.send(customer);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured while updating ${err.message}` );
        return false;
    }
}); 
router.delete('/:id',auth, async (req,res)=>{
    try{
        const customer = await Customers.findByIdAndRemove(req.params.id);
        if(!customer){ res.status(404).send("The genre with given ID is not found");//  resource not found
            return false;
        }; 
        res.send(customer);
        return false;
    }
    catch(err){
        req.status(500).send(`Error occured while deleting + ${err.message}`);
        return false;
    }   
});
module.exports = router;