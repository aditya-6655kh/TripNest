const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const { savedRedirectUrl } = require("../middlewares");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to TripNest!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/loginU");
});

router.post(
  "/login",
  savedRedirectUrl,
  wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const identifier = username || email;

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      req.flash("error", "Invalid username/email or password");
      return res.redirect("/login");
    }

    req.body.username = user.username;
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    })(req, res, next);
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
});

module.exports = router;
