const mongoose = require('mongoose');

const connectDB = async () => {
        const DB = process.env.DB_URI.replace('<db_password>', process.env.DB_PASS);
        await mongoose.connect(DB);
        console.log("DB connection successful..!");
};

module.exports = connectDB;
