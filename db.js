const mongoose = require("mongoose");
// const mongoURI = "mongodb://localhost:27017/passnplay-test";
const mongoURI = "mongodb+srv://Bilal_Ahmed:Bilalahmed@pass-n-play.piuyfw8.mongodb.net/pass-n-play?retryWrites=true&w=majority&appName=Pass-N-Play";

const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("connected");
};

module.exports = connectToMongo;
