const express = require('express');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental ,validate } = require('../models/rental');
const router = express.Router();
const db = require('mongoose');



router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.post('/', async(req, res) => {

    let rental = await Rental.createCollection();
    if(!rental){
        return res.status(400).send('Rental collection does not exist');
    }
    const session =  await db.startSession();
    session.startTransaction();
    const { error }= validate(req.body);
    // console.log(status);
    // console.log(error);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId);
    // console.log(movie);
    if(!movie) return res.status(400).send('Invalid movie');

    
    try{
            rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
        });
        const opts = { session };

        await rental.save(opts);
        movie.numberInStock--;
        // throw new Error( 'bad request');
        await movie.save(opts);
        await session.commitTransaction();
        res.send(rental);

    }catch (error){
        res.send(error.message);
        await session.abortTransacntion();
       
    }finally{
        session.endSession();
    }
})

router.get('/:id', async(req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;