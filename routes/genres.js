const {Genres, validateGenre, genreSchema } = require('../models/genresModel');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();


router.get('/', async (req, res) => {
    try{
        const genres = await Genres.find().sort({name: 1});
        res.send(genres);
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
    
});

router.get('/:id', async (req, res) => {
    try{
        const genre = await Genres.findById(req.params.id);
        if(!genre){ 
            res.status(404).send("The genre with given ID is not found");
            return false;
        }
        res.send(genre);
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
    
});

router.post('/',auth, async (req,res) => {
   // const result = validateGenre(res.body);
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return false;
    }
    try{
        let genre = new Genres({ name: req.body.name });
        genre = await genre.save();
        res.send(genre);
        return false;
    }
    catch(err){
        res.status(500).send(`error occured please try again ${err.message}`);
        return false;
    }
});

router.put('/:id',auth ,async (req,res)=>{
   //const result = validateGenre(req.body);
    // result.error ie equvalent to { error }
    const { error } = validateGenre(req.body); // object destructuring, here result.error can be assigned { error }
    if(error){
        res.status(400).send(error.details[0].message); //  invalid bad request
        return false;
    }
    try{
        
        const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name },{ new: true });
        
        if(!genre){
            res.status(404).send("The genre with given ID is not found"); //  resource not found
            return false;
        }
        res.send(genre);
        return false;
    }
    catch(err){
        res.status(500).send(`Error occured while updating ${err.message}` );
        return false;
    }  
});

router.delete('/:id', [auth,admin], async (req,res)=>{
    try{
        const genre = await Genres.findByIdAndRemove(req.params.id);
        if(!genre){ res.status(404).send("The genre with given ID is not found");//  resource not found
            return false;
        }; 
        res.send(genre);
        return false;
    }
    catch(err){
        req.status(500).send(`Error occured while deleting + ${err.message}`);
        return false;
    }
    
    
});

module.exports = router;