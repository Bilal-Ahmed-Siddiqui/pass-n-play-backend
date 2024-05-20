const mongoose = require("mongoose");

const { Schema } = mongoose;

const Userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // profilePicture: {
  //   data: Buffer, // Store image data as Buffer
  //   contentType: String, // MIME type of the image
  // },
  bank_Name: {
    type: String,
  },
  bank_AccountTitle: {
    type: String,
  },
  bank_AccountNumber: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', Userschema)