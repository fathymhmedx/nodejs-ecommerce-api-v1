const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config({ path: "./config.env" });

// 2. App initialization
const app = express();

// 3. Global middlewares
app.use(express.json())
app.use(helmet());
app.use(cors({
    origin: "*",
    // Allow all origins (change to specific domain in production, like: origin: process.env.CLIENT_URL)
    credentials: true,
}));

// 4. Logger
const { initLogger } = require('./src/shared/config/logger.js')
initLogger(app);

// 5. Mount routes
const routes = require('./src/routes');
app.use('/api/v1/', routes);

// 6. Global Error Handling
const { notFoundHandler, globalErrorHandler } = require('./src/shared/middlewares/errorMiddleware.js');
app.use(notFoundHandler)
app.use(globalErrorHandler);

module.exports = app;