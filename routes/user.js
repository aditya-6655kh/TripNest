const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const { savedRedirectUrl } = require("../middlewares");
const userController = require("../controllers/users.js");

router
  .route("/register")
  .get(userController.renderRegister)
  .post(wrapAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    savedRedirectUrl,
    wrapAsync(userController.loginUser),
    wrapAsync(userController.postLoginRedirect)
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
