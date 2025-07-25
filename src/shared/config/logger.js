const morgan = require('morgan');

const setupDevLogger = (app) => {
    app.use(morgan('dev'));
    console.log('Running in development mode');
};

const setupProdLogger = (app) => {
    app.use(morgan('combined'));
    console.log('Running in production mode');

};

exports.initLogger = (app) => {
    if (process.env.NODE_ENV === 'development') {
        setupDevLogger(app);
    } else {
        setupProdLogger(app);
    }
};
