const ApiError = require('../errors/ApiError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
    const cause = err.cause || err;
    const field = Object.keys(cause.keyValue)[0];
    const value = cause.keyValue[field];

    const message = `Duplicate field:"${field}" with value "${value}". Please use another value!`;
    return new ApiError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join(', ')}`;
    return new ApiError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message || 'Internal server error',
        stack: err.stack
    })
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message too client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR', err);
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: "Something went very wrong!"
        })
    }
}

exports.globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {

        let error = {
            ...err,
            message: err.message,
            name: err.name,
            cause: err.cause,
            stack: err.stack
        };

        const duplicateCode = (error.code === 11000 || error?.cause?.code === 11000);

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (duplicateCode) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

        sendErrorProd(error, res);
    }
}

exports.notFoundHandler = (req, res, next) => {
    next(new ApiError(`Can't find the requested URL: ${req.originalUrl}`, 404));
}