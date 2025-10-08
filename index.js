const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.post("/listings", async (req, res) => {
  const data = req.body.listing;
  const newListing = new Listing(data);
  await newListing.save();
  res.redirect(`/listings/${newListing._id}`);
});

// edit route to display form for editing a listing
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body.listing;
  await Listing.findByIdAndUpdate(id, data, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// show route to display a single listing
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
