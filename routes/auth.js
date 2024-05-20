const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET_KEY = "thatsmykey";

//sign up POST '/api/auth/signup'
router.post(
  "/signup",
  [
    body("name", "Name must be at least 5 characters long").isLength({
      min: 5,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      let success = false;
      if (errors.isEmpty()) {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ success: false, error: "Email already exists" });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // User creation
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        // Token generation
        const UID = { user: { id: newUser.id } };
        const authToken = jwt.sign(UID, JWT_SECRET_KEY);

        success = true;
        return res.json({ success, authToken });
      } else {
        return res.status(400).json({ success: false, error: errors.array() });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error!");
    }
  }
);

//sign in POST '/api/auth/login'
router.post(
  "/login",
  body("email", "enter a valid email").isEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      let success = false;
      if (errors.isEmpty()) {
        const { email, password } = req.body;
        try {
          let user = await User.findOne({ email });
          if (!user) {
            success = false;
            return res
              .status(400)
              .json({ success: success, error: "Wrong email or password" });
          }
          const passCheck = await bcrypt.compare(password, user.password);
          if (!passCheck) {
            success = false;

            return res
              .status(400)
              .json({ success: success, error: "Wrong email or password" });
          }
          const UID = {
            user: {
              id: user.id,
            },
          };
          const authtoken = jwt.sign(UID, JWT_SECRET_KEY);
          success = true;
          res.json({ success, authtoken });
        } catch (error) {
          return res.json({ error: error.message });
        }
      } else {
        success = false;
        return res
          .status(400)
          .json({ success: success, error: errors.array() });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

//fetch user data GET '/api/auth/getuser'
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.send(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error!");
  }
});

//Update User Data PUT '/api/auth/updateuser'
router.put(
  "/updateuser",
  fetchUser,
  [
    body("name", "Name can not be empty").not().isEmpty(),
    body("bank_Name", "bank_Name can not be empty").not().isEmpty(),
    body("bank_AccountTitle", "bank_AccountTitle can not be empty")
      .not()
      .isEmpty(),
    body("bank_AccountNumber", "bank_AccountNumber can not be empty")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      let user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).send("User Not Found!");
      }
      const updateFields = [
        "name",
        "bank_Name",
        "bank_AccountTitle",
        "bank_AccountNumber",
      ];
      const updatedUser = {};

      updateFields.forEach((field) => {
        if (req.body[field]) {
          updatedUser[field] = req.body[field];
        }
      });

      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updatedUser },
        { new: true }
      );

      res.send("User Info updated");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

module.exports = router;
