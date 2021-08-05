const mongoose = require('mongoose');

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.it9bf.mongodb.net/${process.env.DB_COLLECTION}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));