const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customer: String,
  cars: { type: [String], required: true },
    date: { type: Date, default: Date.now },
});

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
