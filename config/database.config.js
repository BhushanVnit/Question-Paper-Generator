const mongoose = require('mongoose');

function connectToDatabase() {

    const MongoUrl = process.env.MONGO_CONNECTION_URL;

    // const MongoUrl = "mongodb://0.0.0.0:27017/questionPaperGenerator";
    mongoose.set('strictQuery', true);
    mongoose.connect(MongoUrl);
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connection successful...");
    });
    
    mongoose.connection.on("error", (err) => {
        console.log("Error connecting to MongoDB:", err);
    });
}

module.exports = {
    connectToDatabase,
};
