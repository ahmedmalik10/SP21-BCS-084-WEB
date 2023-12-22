var express = require("express");
var router = express.Router();
var Cars = require("../../models/cars");
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
  let cars = await Cars.findById(req.params.id);
  return res.send(cars);
});
 router.post("/", upload.single("image"), async function (req, res, next) {
  let car = new Cars(req.body);
  if (req.file) car.image = req.file.filename;
  await car.save();
  res.send(car);
});
router.put("/:id", async function (req, res, next) {
  let car = await Cars.findById(req.params.id);
  car.model = req.body.model;
  car.seating = req.body.seating;
  car.company = req.body.company;
  car.engine = req.body.engine;
  car.color = req.body.color;
  car.price = req.body.price;
    await car.save();
  return res.send(car);
});
router.delete("/:id", async function (req, res, next) {
  try {
    let car = await Cars.findById(req.params.id);
    await car.delete();
    return res.send("deleted");
  } catch (err) {
    return res.status(400).send("Invalid Id");
  }
});

router.get("/", async function (req, res, next) {
  console.log("inside");
  setTimeout(async () => {
    let cars = await Cars.find();

    res.send(cars);
  }, 5000);
});
module.exports = router;
