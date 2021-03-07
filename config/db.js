const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://foodydev:dbFoodyDev@cluster0.it9bf.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
