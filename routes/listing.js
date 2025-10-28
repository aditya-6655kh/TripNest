const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(",")
    );
  } else {
    next();
  }
};

// index route to display all listings
router.get("/", async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
});

// new route to display form for creating a new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// create route to add a new listing to the database
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const data = req.body.listing;
    const newListing = new Listing(data);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  })
);

// edit route to display form for editing a listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;
    await Listing.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// show route to display a single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
