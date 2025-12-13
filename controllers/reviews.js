const express = require("express");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.index = (req, res) => {
  const { id } = req.params;
  res.render("reviews/reviewForm.ejs", { listing: { _id: id } });
};

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const newReview = new Review(req.body.review);
  const listing = await Listing.findById(id);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully added a new review!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const listing = await Listing.findById(id);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  res.render("reviews/editReview.ejs", { listing, review });
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndUpdate(
    reviewId,
    req.body.review,
    { new: true }
  );
  req.flash("success", "Successfully updated the review!");
  res.redirect(`/listings/${id}`);
};
