const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const { savedRedirectUrl } = require("../middlewares");
const userController = require("../controllers/users.js");

router.get("/register", userController.renderRegister);

router.post("/register", wrapAsync(userController.registerUser));

router.get("/login", userController.renderLogin);

router.post(
  "/login",
  savedRedirectUrl,
  wrapAsync(userController.loginUser),
  wrapAsync(userController.postLoginRedirect)
);

router.get("/logout", userController.logoutUser);

module.exports = router;
