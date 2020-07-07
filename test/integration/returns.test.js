const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');
const request= require('supertest');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;
    beforeEach( async() => {
        server = require('../../index')
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            },
        });
        await rental.save();
    })

    afterEach( async () => {
        await Rental.remove({});
        await Movie.remove({});
        await server.close(); 
    })

    const exec =  () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId});
    }

    it('should return 401 if client is not logged in !', async () => {
        token = '';
        const res = await exec();
        await expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        await expect(res.status).toBe(400);
    })
    it('should return 400 if movieId is not provided', async () => {
        movieId = ''
        const res = await exec();
        await expect(res.status).toBe(400);
    })

    it('should return 404 if no rental found for the customer/movie', async () => {
        await Rental.remove({});
        const res = await exec();
        await expect(res.status).toBe(404);
    })

    it('should return 400 if return is already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);

    })

    it('should return 200 if we have valid request ', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    })

    it('should set the returnDate if input is valid ', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 *1000)
    })

    it('should set the rentalFee if input is valid ', async () => {
        // dateOut (current time) by default
        // want movie out for at least on day 
        // we need to modify this rental document in the database before calling the execute function

        rental.dateOut = moment().add(-7, 'days').toDate(); //meaning 7 days before
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14); // assuming $2 per day rent for 7 days
    })

    it('should increase movie stock if input is valid ', async () => {
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })

    it('should return the rental if input is valid ', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id)
        // expect(res.body).toHaveProperty('dateOut');
        // expect(res.body).toHaveProperty('dateReturned');
        // expect(res.body).toHaveProperty('rentalFee');
        // expect(res.body).toHaveProperty('customer');
        // expect(res.body).toHaveProperty('movie');
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']))
    })
});