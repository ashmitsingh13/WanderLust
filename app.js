const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World");
}); 

app.get("/listings", async (req, res) => {
    let sampleListings = new Listing({
      title: "Sample Listing",
      description: "This is a sample listing description.",
      image: ["https://images.unsplash.com/photo-1745894118353-88e64617e064?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
      price: 100,
      location: "Sample Location",
      country: "Sample Country"
    });
    try {
        await sampleListings.save();
        console.log("Sample listing saved successfully");
        res.send("Sample listing saved successfully");
    } catch (err) {
        console.error("Error saving sample listing:", err);
    }
});
