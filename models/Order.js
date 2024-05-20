const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  title: { type: String, required: true },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
    default: 500,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  returnableAmount: {
    type: Number,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", OrderSchema);
