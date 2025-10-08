const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  image: {
    fileName: { type: String, default: "default-image.jpg" },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1470&q=80",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1470&q=80"
          : v,
    },
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
