
const mongoose = require('mongoose');
const logger = require('./logging');
const config = require('config');

module.exports = function (){
    const db = config.get('db');
    // const db = 'mongodb://localhost:27017,localhost:27018,localhost:27019/movieRental?replicaSet=rs';
    mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
  .then(() => {
    // winston.info('Connected to MongoDB...');
    logger.info(`Connected to MongoDB to ${db}`);
  })
}
