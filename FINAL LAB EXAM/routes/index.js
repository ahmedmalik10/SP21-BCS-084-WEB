var express = require("express");
var router = express.Router();
var Cars = require("../models/cars");
var User = require("../models/User");
var Order = require("../models/orders");

const bcrypt = require("bcryptjs");
/* GET home page. */
router.get("/login", function (req, res, next) {
  return res.render("site/login");
});
router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.render("/", {
      user
    });
  }
});


//   let results =[]
//   if(req.body.operator=='+'){
//     let adder = req.body.operand1 + req.body.operand2;
//     results.push(adder)
//   }
//   if(req.body.operator=='-'){
//     let sub = req.body.operand1 - req.body.operand2;
//     results.push(sub)
//   }
//   if(req.body.operator=='/'){
//     let divide = req.body.operand1 / req.body.operand2;
//     results.push(divide)
//   }
//   if(req.body.operator=='*'){
//     let mul = req.body.operand1 * req.body.operand2;
//     results.push(mul)
//   }

//   req.session.result = results;

//     return res.render("site/final", {
//       user
//     });
// });


router.get("/register", function (req, res, next) {
  return res.render("site/register");
});
router.get("/logout", async (req, res) => {
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login");
});
router.post("/register", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    return res.redirect("/register");
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.redirect("/login");
});
router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact", { layout: "layout" });
});
router.get("/", async function (req, res, next) {
  return res.render("site/homepage", {
    pagetitle: "Cars4Show"
  });
});

// router.post('layouts/partials/header', (req, res) => {
//   const minPrice = req.body.minPrice;
//   const maxPrice = req.body.maxPrice;
// res.render('site/range', { minPrice, maxPrice });
// });

router.get("/allcars", async function (req, res, next) {
  let cars = await Cars.find();
  let users = await User.find();
  let orders = await Order.find();
  console.log(orders.length);
 
  return res.render("site/allcars", { cars,
    users,orders
  });
});




router.post("/final", async function (req, res, next) {

  console.log('Received request body:', req.body);
 req.session.operations = req.session.operations || [];

 if (req.body.operand1 !== undefined && req.body.operand2 !== undefined && req.body.operator !== undefined) {
   let result;
   switch (req.body.operator) {
     case '+':
      const operand1 = parseFloat(req.body.operand1);
      const operand2 = parseFloat(req.body.operand2);
       result = operand1 + operand2;
       break;
     case '-':
       result = req.body.operand1 - req.body.operand2;
       break;
     case '/':
       result = req.body.operand1 / req.body.operand2;
       break;
     case '*':
       result = req.body.operand1 * req.body.operand2;
       break;
     default:
       res.status(400).json({ error: 'Invalid operator' });
       return;
   }

   const operation = {
     operand1: req.body.operand1,
     operand2: req.body.operand2,
     operator: req.body.operator,
     result: result
   };

   req.session.operations.push(operation);
   console.log('Redirecting');
   res.redirect('/final');
 } else {
   res.status(400).json({ error: 'operand1, operand2, and operator are required in the request body' });
 }
});


router.get("/final", async function (req, res, next) {
  return res.render("site/final", {
    operations: req.session.operations || [] 
  });
});


module.exports = router;
