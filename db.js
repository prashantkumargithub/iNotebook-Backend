const mongoose = require('mongoose');

const mongoURI = process.env.MongoDbURL;
const connectToMongo = async () => {
    await mongoose.connect(mongoURI)
    console.log(`The Database connected`);
}

module.exports = connectToMongo;
