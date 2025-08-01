const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingsController = require('../controllers/listings.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage});

//Index Route
router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingsController.createListing));

//New Route
router.get('/new', isLoggedIn, (listingsController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), wrapAsync(listingsController.updateListing))
.delete( isLoggedIn, wrapAsync(listingsController.deleteListing));

//Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));


module.exports = router;