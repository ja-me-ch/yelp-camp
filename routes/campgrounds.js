const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const campgroundsController = require('../controllers/campgrounds')
const { isLoggedIn, validateCampground, isAuthor } = require('../utils/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground));

router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundsController.renderCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));



module.exports = router;