const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

// api/order
router.post("/", (req, res) => {
  res.send("order ep");
});

// fetch user orders, GET, '/api/order/userorders'
router.get("/userorders", fetchUser, async (req, res) => {
  try {
    const posts = await Order.find({ user: req.user.id });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//create order, POST, '/api/order/create', requires auth
router.post(
  "/create",
  fetchUser,
  [
    body("title", "title can not be empty").not().isEmpty(),
    body("DeliveryPrice", "Delivery Price can not be empty").not().isEmpty(),
    body("deliveryAddress", "Delivery Address can not be empty")
      .not()
      .isEmpty(),
    body("totalPrice", "total Price can not be empty").not().isEmpty(),
    body("rentAmount", "rent Amount can not be empty").not().isEmpty(),
    body("depositAmount", "deposit Amount can not be empty").not().isEmpty(),
    body("returnableAmount", "returnable Amount can not be empty")
      .not()
      .isEmpty(),
    body("returnDate", "return date can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      const {
        post,
        title,
        deliveryAddress,
        DeliveryPrice,
        totalPrice,
        rentAmount,
        depositAmount,
        returnableAmount,
        returnDate,
      } = req.body;

      const newOrder = Order({
        user: req.user.id,
        post,
        title,
        deliveryAddress,
        DeliveryPrice,
        totalPrice,
        rentAmount,
        depositAmount,
        returnableAmount,
        returnDate,
      });
      const order = await newOrder.save();
      let success = true
      res.json({success,order});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// fetch order by id, GET, '/api/order/id'
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
