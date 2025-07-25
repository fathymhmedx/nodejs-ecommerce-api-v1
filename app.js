const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');
// Routers
const categoryRouter = require('./routes/categoryRoutes');
const subCategoryRouter = require('./routes/subCategoryRoute');
const brandRouter = require('./routes/brandRoutes.js');
const productRouter = require('./routes/productRoute.js');

const app = express();

// Middlewares
app.use(express.json())
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Routes
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subcategories', subCategoryRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/products', productRouter) 

app.use(notFoundHandler)
app.use(globalErrorHandler);
module.exports = app;