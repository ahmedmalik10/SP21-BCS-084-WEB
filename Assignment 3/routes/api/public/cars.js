var express = require("express");
var router = express.Router();
var Cars = require("../../../models/cars");

router.get("/", async function (req, res, next) {
  console.log("inside");
  setTimeout(async () => {
    let cars = await Cars.find();

    res.send(cars);
  }, 5000);
});
module.exports = router;
