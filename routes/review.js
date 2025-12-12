const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isAuthor } = require("../middlewares");
const reviewController = require("../controllers/reviews");

router.get("/", isLoggedIn, reviewController.index);

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
