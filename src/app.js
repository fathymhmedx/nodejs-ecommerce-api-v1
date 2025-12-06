const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const compression = require('compression');


// const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config({ path: "../config.env" });

// 2. App initialization
const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// 3. Global middlewares

// Initial security (before any parsing)
app.use(helmet());
app.use(hpp({ whitelist: ['category', 'subCategories', 'brand'] }));

// CORS (before cookies)
app.use(cors({
    // Allow all origins (change to specific domain in production, like: origin: process.env.CLIENT_URL)
    origin: process.env.CLIENT_URL,
    credentials: true, // Important because cookies are sent via CORS
}));

// Cookie Parser
app.use(cookieParser());

// webhookCheckout Must be used befor (express.json and express.urlencoded).
const { webhookCheckout } = require('./modules/order/order.controller.js');
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);

// Body Parsers
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }));

// Compression
app.use(compression());

// Static Files
app.use(express.static(path.join(__dirname, './src/uploads')));

// 4. Logger
const { initLogger } = require('./shared/config/logger.js')
initLogger(app);

// 5. Mount routes
const v1Routes = require('./routes/index.js');
app.use('/api/v1/', v1Routes);

// 6. Global Error Handling
const { notFoundHandler, globalErrorHandler } = require('./shared/middlewares/errorMiddleware.js');
app.use(notFoundHandler)
app.use(globalErrorHandler);

module.exports = app;