const mongoose = require("mongoose");
const Data = require("./sampleData.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/tripNest");
    console.log("Connected to MongoDB");

    // Run seeding only after connection is established
    await seedDB();

    console.log("DB Seeded");
  } catch (err) {
    console.log("Error:", err);
  } finally {
    // Always close the connection after operations
    mongoose.connection.close();
  }
}

async function seedDB() {
  await Listing.deleteMany({});
  await Listing.insertMany(Data.data);
}

// Call main
main();
