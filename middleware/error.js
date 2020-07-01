const  logger = require('../startup/logging');

//only works on errors that happedn in the request processing pipeline
module.exports =function (err, req, res, next){
    // Log the exception
    logger.error(err.message, () => err);
    // console.log(err);
    res.status(500).send('Something failed.');
  };
  