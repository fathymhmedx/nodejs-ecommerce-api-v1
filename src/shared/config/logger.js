const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const setupDevLogger = (app) => {
    app.use(morgan('dev'));
    console.log('Running in development mode');
};

const setupProdLogger = (app) => {
    // Create logs directory if not exists
    const logDir = path.join(__dirname, '../../../logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const accessLogStream = fs.createWriteStream(
        path.join(logDir, 'access.log'),
        { flags: 'a' }
    );
    
    app.use(morgan('combined', { stream: accessLogStream }));
    console.log('Running in production mode');

};

exports.initLogger = (app) => {
    if (process.env.NODE_ENV === 'development') {
        setupDevLogger(app);
    } else {
        setupProdLogger(app);
    }
};
