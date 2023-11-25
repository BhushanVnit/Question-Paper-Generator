const express = require('express');
const { connectToDatabase } = require('./config/database.config');
const routes = require('./routes');
require('dotenv').config({ path: __dirname + "/.env" });
PORT = process.env.PORT || 8080

const app = express();

// Middlewares
app.use(express.json());
app.use(routes);

// Connect to MongoDB
connectToDatabase();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT} \nhttp://localhost:${PORT}`);
});
