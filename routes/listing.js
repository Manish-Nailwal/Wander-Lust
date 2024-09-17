const express = require('express');
const router = express.Router({ mergeParams: true });
const { isloggedIn, listValidation, isOwner } = require('../util/middleware');
const listingController = require('../controllers/listing');

//multer
const multer = require('multer');
const {storage} = require('../cloudConfig');
const upload = multer({ storage: storage });


router.route('/')
    // Display all listings
    .get(listingController.allListing)
    // create Listing
    .post( isloggedIn, upload.single('data[image]'),listingController.createListing);   //add listValidation, //


// Render create form
router.get('/create', isloggedIn, listingController.renderCreateForm);//


router.route('/edit/:id')
    // Render the form for editing a listing
    .get( isloggedIn, isOwner, listingController.renderEditForm)
    // Handle update of an existing listing
    .put( isloggedIn, isOwner,upload.single('data[image]'), listValidation, listingController.updateListing);    //


router.route('/:id')
    // Handle deletion of a listing
    .delete(isloggedIn, isOwner, listingController.deleteListing)
    // Display a specific listing
    .get(listingController.expandList);


module.exports = router;