const express =require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');


// refactoring index.js app.use(routess )
module.exports= function (app) {
    //all middleware functions
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth',auth);
//registered this function after all the exisiting middleware funcs, 
// when we call next() it will pass to first argument which is 'err'
app.use(error);
}
