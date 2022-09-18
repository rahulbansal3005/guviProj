const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
// const JWT_KEY='bdjvbjsbvkkvks'
const JWT_KEY = require("../secrets");
authRouter.route("/signup").get(getSignup).post(postSignup);
authRouter.route("/login").post(loginUser);

function getSignup(req, res) {
  res.sendFile("index.html", { root: __dirname });
}

async function postSignup(req, res) {
  let dataObj = req.body;
  // console.log('backend',obj);
  let user = await userModel.create(dataObj);
  res.json({
    message: "user signed up",
    data: user,
  });
}

async function loginUser(req, res) {
  try {
    let data = req.body;
    let user = await userModel.findOne({ email: data.email });
    if (user) {
      // bcrypt ka compare function hota hai jo hashed password aur entered password ko compare kar lega
      if (user.password == data.password) {
        let uid = user["_id"]; //uid
        let token = jwt.sign({ payload: uid }, JWT_KEY);
        res.cookie("login", token, { httpOnly: true });
        return res.json({
          message: "user logged in",
          data: data,
        });
      } else {
        return res.json({ message: "Wrong Password Entered" });
      }
    } else {
      return res.json({ message: "user not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = authRouter;
