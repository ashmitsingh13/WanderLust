const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review.js');
const listings = require("./routes/listing.js");
const ExpressError = require("./utils/ExpressError.js");

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

main().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', Review)

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message })
})
