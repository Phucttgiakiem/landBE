const DATABASE_NAME = process.env.DATABASE_NAME || 'Property';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/'+ DATABASE_NAME;

import mongoose from 'mongoose';

// Connect to MongoDB
const connectToMongoDB = () => {
    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = connectToMongoDB;
