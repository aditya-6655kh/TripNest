const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(",")
    );
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  const { id } = req.params;
  res.render("listings/reviewForm.ejs", { listing: { _id: id } });
});

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
