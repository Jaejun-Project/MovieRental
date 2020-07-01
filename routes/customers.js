const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');

router.get('/', async(req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
})// end get customer s

router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  await customer.save();
  res.send(customer);
}); //end create customer

router.put('/:id', async(req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
     {
       name: req.body.name,
       phone: req.body.phone
     }, { new: true });

     if(!customer){
       return res.status(404).send('Customer with the given ID was not found.')
     }
     res.send(customer);
}); //end update customer

router.delete('/:id', async(req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id);
  if(!customer){
    return res.status(404).send('Customer with the given ID was not found.')
  }
  res.send(customer);
})

router.get('/:id', async(req, res) => {
  const customer = await Customer.findById(req.id);
  if(!customer){
    return res.status(404).send('Customer with the given ID was not found.')
  }
  res.send(customer);
})

module.exports = router;
