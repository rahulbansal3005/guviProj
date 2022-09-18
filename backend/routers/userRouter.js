const express = require("express");
const userRouter = express.Router();

const { getUser } = require("../controllers/userController");
const {
  signup,
  login,
  protectRoute,
} = require("../controllers/authController");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

userRouter.use(protectRoute);
userRouter.route("/userProfile").get(getUser);
module.exports = userRouter;
