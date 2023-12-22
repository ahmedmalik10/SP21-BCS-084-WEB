var express = require("express");
var router = express.Router();
var Orders = require("../../../models/orders");

router.get("/", async function (req, res, next) {
  console.log("inside");
  setTimeout(async () => {
    let orders = await Orders.find();

    res.send(orders);
  }, 5000);
});
module.exports = router;
