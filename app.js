const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');


// const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config({ path: "./config.env" });

// 2. App initialization
const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// 3. Global middlewares

app.use(express.json())
app.use(express.static(path.join(__dirname, './src/uploads')));

app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());

app.use(cors({
    origin: "*",
    // Allow all origins (change to specific domain in production, like: origin: process.env.CLIENT_URL)
    credentials: true,
}));

// 4. Logger
const { initLogger } = require('./src/shared/config/logger.js')
initLogger(app);

// 5. Mount routes
const v1Routes = require('./src/routes');
app.use('/api/v1/', v1Routes);

// 6. Global Error Handling
const { notFoundHandler, globalErrorHandler } = require('./src/shared/middlewares/errorMiddleware.js');
app.use(notFoundHandler)
app.use(globalErrorHandler);

module.exports = app;