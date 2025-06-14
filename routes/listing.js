const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//Index Route
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('index.ejs', { allListings })
}));

//New Route
router.get('/new', (req, res) => {
  res.render('new.ejs');
});

//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('show.ejs', { listing });
}));

//Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));

//Edit Route
router.get('/:id/edit', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('edit.ejs', { listing });
}));

//Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/${id}`);
}));

//Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with id ${id} deleted`);
  res.redirect('/');
}));


module.exports = router;