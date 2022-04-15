const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({
    accessToken: mapBoxToken
});


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {
        title: 'All Campgrounds',
        campgrounds
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs', {
        title: 'Add New Campground'
    });
};

module.exports.renderCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'
    })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', {
        title: campground.title,
        campground
    });
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    campground.author = req.user._id
    await campground.save();
    console.log(campground);
    req.flash('success', 'Campground successfully created.');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'That campground cannot be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', {
        title: `Edit ${campground.title}`,
        campground
    });
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(f => ({ url: f.path, fileName: f.filename} ));
    campground.images.push(...images);
    await campground.save();

    if (req.body.deleteImages) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName);
        }
        await campground.updateOne({
            $pull: {
                images: {
                    fileName: {
                        $in: req.body.deleteImages
                    }
                }
            }
        });
        console.log(campground);
    }

    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
};