const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental')
const {Movie} = require('../models/movie')
const auth = require('../middleware/auth')
const Joi = require('joi');
const validate = require('../middleware/validate');


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    // throw new Error('Could not get genres');
    // if(!req.body.customerId) return res.status(400).send('customerID not provided')
    // if(!req.body.movieId) return  res.status(400).send('movieId is not provided')

    // const { error } = validateReturn(req.body);
    // if (error) return res.status(400).send(error.details[0].message);



    // Static: Rental.lookup ( available directly on class)
    // Instance: new User().genrateAuthToken() available on an object or instanc of class 
  
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);


  
    if(!rental) return res.status(404).send('Rental not found.');

    if(rental.dateReturned) return res.status(400).send('return already processed')


    rental.return();// refactoring the below code will bring below operation (calculation)
    // Information Expert Principle ( need encapsulation)
        // rental.dateReturned = new Date(); 
        // const rentalDays = moment().diff(rental.dateOut, 'days');
        // rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;    
    await rental.save();


    await Movie.findOneAndUpdate({_id: rental.movie._id}, {$inc: { numberInStock: 1 }});

    return res.send(rental);
  });

  function validateReturn(rental) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
  }
  
  module.exports = router;  
  