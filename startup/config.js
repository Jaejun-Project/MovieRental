const config = require('config');
const logger = require('./logging');

module.exports =function() {
    if (!config.get('jwtPrivateKey')){
        // throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
        logger.error('FATAL ERROR: jwtPrivateKey is not defined.');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}
