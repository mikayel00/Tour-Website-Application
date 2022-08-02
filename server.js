const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION // Server is shutting down...');
    process.exit(1);
})

const app = require('./app.js');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
})  
    .then(() => console.log('DB has been connected!'))
    // .catch(err => console.log('ERROR'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}...`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION // Server is shutting down...');
    server.close(() => {
        process.exit(1);
    })
});
