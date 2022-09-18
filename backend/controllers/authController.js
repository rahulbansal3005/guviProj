const express = require("express");
const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");

module.exports.signup = async function signup(req, res) {
  try {
    let dataObj = req.body;
    // console.log('backend',obj);
    let user = await userModel.create(dataObj);
    if (user) {
      return res.json({ success: true, message: "user signed up", data: user });
    } else {
      return res.json({
        success: false,
        message: "error while signing up",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        // bcrypt ka compare function hota hai jo hashed password aur entered password ko compare kar lega
        if (user.password == data.password) {
          let uid = user["_id"]; //uid
          // ! Documentation dekh lena sign ki.
          let token = jwt.sign({ payload: uid }, JWT_KEY);
          res.cookie("login", token, { httpOnly: true });
          return res.json({
            success: true,
            message: "user logged in",
            data: data,
            token: token,
          });
        } else {
          return res.json({
            success: false,
            message: "Wrong Password Entered",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "user not found from login function in authController",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Empty field found",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      console.log(req.cookies);
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
      if (payload) {
        // const user = await userModel.findById({ id: payload });
        // req.role = user.role;
        // req.id = user.id;
        // next();
        console.log("payload token", payload);
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        console.log(req.role, req.id);
        next();
      } else {
        return res.json({
          message: "please login again",
        });
      }
    } else {
      res.json({
        message: "please login",
      });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};
