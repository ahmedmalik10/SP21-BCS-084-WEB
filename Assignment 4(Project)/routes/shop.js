var express = require("express");
var router = express.Router();
var Cars = require("../models/cars");
var Orders = require("../models/orders");

router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let cars = await Cars.find({ _id: { $in: cart } });
  
  let total = cars.reduce(
    (total, cars) => total + parseFloat(cars.price.replace(',','')),
    0
  );
  
  res.render("site/cart", { cars, total });
});

router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  req.flash("success", "Car Order Placed");
  res.redirect("/allcars");
});

router.get("/remove-cart/:id", async function (req, res) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  const carIndex = cart.indexOf(req.params.id);
  if (carIndex !== -1) {
    cart.splice(carIndex, 1);
    req.flash("success", "Car Removed From Cart");
    res.cookie("cart", cart);
  }
  let cars = await Cars.find({ _id: { $in: cart } });
  let total = cars.reduce(
    (total, cars) => total + parseFloat(cars.price.replace(',','')),
    0
  );
  
    res.render("site/cart", { cars, total });
  
});


router.post('/place-order', async (req, res) => {

  const cars = req.body.carsId;
  const customer = req.session.user;
  const currentDate = Date.now();
  const order = new Orders({customer:customer, cars: cars , date : currentDate});

  try {
    const savedOrder = await order.save();
    console.log('Order placed:', savedOrder); 
    return res.redirect("/");
  } catch (error) {
    req.flash("danger", "Oops! There was an error while placing your Order");
    console.error('Error placing order:', error);
    res.status(500).send('Error placing order');
  }
});

module.exports = router;
