const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const { describe } = require('joi');
require('../../models/genre');
let server;

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index')
    }) 
    afterEach( async () => {
        await Genre.remove({});
        await server.close();
        
    })
    describe('GET / ', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2); 
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id ', () => {
        it('should return a genres if valid id is passed', async () => {
            const genre = new Genre( {name: 'genre1'});
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
        it('should return 404 if no genre with the given Id', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });
    describe('POST / ', () => {

        //Define the happy path, and then in each test, we change
        //one parameter that clearly aligns with the name of the test.

        let token;
        let name;

        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: name});
        } 
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should save genre it is valid', async () => {
            await exec();
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
        });
        it('should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });
    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
            .send();
        } 
        beforeEach(async () => {
            genre = new Genre({ name: 'genre'});
            await genre.save();
            id = genre._id;
            token = new User({ isAdmin: true}).generateAuthToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken(); 
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();
            const genreRemoved = await Genre.findById(id);
            expect(genreRemoved).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return the 404 if there is no genre to delete', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        })
    });

    // describe('PUT /:id', () => {
    //     let name;
    //     const exec = () => {
    //         return await request(server)
    //             .put('/api/genres/' + id)
    //             .send({name: name})
    //     }

    // });
});