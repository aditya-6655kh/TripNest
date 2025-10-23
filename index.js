const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const { listingSchema } = require("./schema.js");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tripNest");
}

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

app.get("/", (req, res) => {
  res.send("hello world");
});

// index route to display all listings
app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
});

// new route to display form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// create route to add a new listing to the database
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const data = req.body.listing;
    const newListing = new Listing(data);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  })
);

// edit route to display form for editing a listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// show route to display a single listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
