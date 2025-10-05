const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  image: {
    fileName: String,
    url: {
      type: String,
      default: "clg.jpg",
      set: (v) => (v === "" ? "clg.jpg" : v),
    },
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
