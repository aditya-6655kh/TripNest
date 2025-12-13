const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listings = require("../controllers/listings");

const {
  isLoggedIn,
  validateListing,
  validateOwnership,
} = require("../middlewares");

router
  .route("/")
  .get(wrapAsync(listings.index))
  .post(isLoggedIn, validateListing, wrapAsync(listings.createListings));

// new route to display form for creating a new listing
router.get("/new", isLoggedIn, listings.renderNewForm);

router
  .route("/:id")
  .put(
    isLoggedIn,
    validateListing,
    validateOwnership,
    wrapAsync(listings.updateListing)
  )
  .get(wrapAsync(listings.showListing))
  .delete(isLoggedIn, validateOwnership, wrapAsync(listings.deleteListing));

// edit route to display form for editing a listing
router.get("/:id/edit", isLoggedIn, wrapAsync(listings.renderEditForm));
module.exports = router;
