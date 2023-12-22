var express = require("express");
var router = express.Router();
var Orders = require("../../models/orders");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });
router.get("/:id", async function (req, res, next) {
  let orders = await Orders.findById(req.params.id); // Update variable name
  return res.send(orders);
});

router.post("/", async function (req, res, next) {
  try {
    let newOrder = new Orders(); // Update variable name
    newOrder.customer = req.session.user;
    newOrder.cars = req.body;
    newOrder.Date = Date.now;
    await newOrder.save();
    res.send(newOrder);
    } catch (err) {
    return res.status(400).send("Invalid Id");
  }

});

router.put("/:id", async function (req, res, next) {
  let order = await Orders.findById(req.params.id);
  order.customer = req.body.customer;
  order.cars = req.body.cars;
  order.Date = req.body.date;
  await order.save();
  return res.send(order);
});
router.delete("/:id", async function (req, res, next) {
  try {
    let order = await Orders.findById(req.params.id); // Update variable name
    await order.delete();
    return res.send("deleted");
  } catch (err) {
    return res.status(400).send("Invalid Id");
  }
});

module.exports = router;
