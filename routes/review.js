const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isAuthor } = require("../middlewares");
const reviewController = require("../controllers/reviews");

router
  .route("/")
  .get(isLoggedIn, reviewController.index)
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.renderEditForm)
);

router
  .route("/:reviewId")
  .put(
    isLoggedIn,
    isAuthor,
    validateReview,
    wrapAsync(reviewController.updateReview)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
