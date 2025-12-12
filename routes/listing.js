const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");
const {
  isLoggedIn,
  validateListing,
  validateOwnership,
} = require("../middlewares");

// index route to display all listings
router.get("/", async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
});

// new route to display form for creating a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// create route to add a new listing to the database
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const data = req.body.listing;
    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  })
);

// edit route to display form for editing a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  validateOwnership,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;
    let listing = await Listing.findById(id);

    await Listing.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  validateOwnership,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  })
);

// show route to display a single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
