const { createLogger, transports, format} = require('winston');
// require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.File({
            filename: './log/logfile.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.simple())
        }),
        // new transports.MongoDB({
        //     level:' error',
        //     db: 'mongodb://localhost:27017,localhost:27018,localhost:27019/movieRental?' + 'replicaSet=rs',
        //     option: { 
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true,
        //         useCreateIndex: true,
        //         useFindAndModify: false
        //     },
        //     collection: 'errorLogs',
        //     format: format.combine(format.timestamp(), format.json())
        // })
    ],
    exceptionHandlers: [
        new transports.File({
            filename: './log/exceptions.log',
            level: 'error',
        }),
    ],
    rejectionHandlers: [
        new transports.File({ 
            filename: './log/rejections.log',
            level: 'error'
        }),
    ]
})

module.exports = logger;