const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listings = require("../controllers/listings");

const {
  isLoggedIn,
  validateListing,
  validateOwnership,
} = require("../middlewares");

// index route to display all listings
router.get("/", wrapAsync(listings.index));

// new route to display form for creating a new listing
router.get("/new", isLoggedIn, listings.renderNewForm);

// create route to add a new listing to the database
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listings.createListings)
);

// edit route to display form for editing a listing
router.get("/:id/edit", isLoggedIn, wrapAsync(listings.renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  validateOwnership,
  wrapAsync(listings.updateListing)
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  validateOwnership,
  wrapAsync(listings.deleteListing)
);

// show route to display a single listing
router.get("/:id", wrapAsync(listings.showListing));

module.exports = router;
