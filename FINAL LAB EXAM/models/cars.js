const mongoose = require("mongoose");
const carSchema = mongoose.Schema({
    
    model: String,
    title: String,
    seating: String,
    company:String,
    engine:String,
    color: String,
    price: String,
    image: String,
});
const Cars = mongoose.model("Cars", carSchema);
module.exports = Cars;
