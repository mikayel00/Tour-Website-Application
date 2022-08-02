const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = err.message;
    return new AppError(message, 400, err.name);
}

const handleDuplicateFieldsDB = err => {
    console.log(err);
    const value = JSON.stringify(err.keyValue);
    const message = `Duplicate field value: ${value} Please use another value!`;
    return new AppError(message, 400, err.name);
}

const handleValidationErrorDB = err => {
    const message = err.message;
    return new AppError(message, 400, err.name);
}

const handleJWTError = () => new AppError('Invalid Token,please log in again', 401);

const handleJWTExpired = () => new AppError('Your Token has expired!Please log in again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else{
        console.error('ERROR', err);
        res.status(500).json({
            status: 'error',
            message: 'Something gone wrong'
        })
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production') {
        let error = {...err};
        if(err.name === 'CastError') error = handleCastErrorDB(err);
        if(err.code === 11000) error = handleDuplicateFieldsDB(err);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(err);
        if(err.name === 'JsonWebTokenError') error = handleJWTError();
        if(err.name === 'TokenExpiredError') error = handleJWTExpired();
        sendErrorProd(error, res);
    }
};