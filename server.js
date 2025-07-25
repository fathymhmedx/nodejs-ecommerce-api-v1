process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...!');
    console.log(err.name, err.message);
    process.exit(1);
});

// Load environment variables from the config.env file
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })

const connectDB = require('./config/database');
// Import the Express app (main: app.js)
const app = require('./app');

const PORT = process.env.PORT || 8000;
let server;

// Connect to DB then start the server
connectDB()
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log("DB connection faild:", error.message);
        // Exit process if DB connection fails
        process.exit(1);
    });

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting Down..!');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
})
