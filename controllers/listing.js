const { wrapAsync } = require('../util/wrapAsync');
const Listing = require('../models/listing');

module.exports.renderCreateForm = (req, res) => {
    res.render('listings/create');
}

module.exports.createListing = wrapAsync(async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing({ ...req.body.data });
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash('success', 'List created!');
    res.redirect('/listings');
})


module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    res.render('./listings/edit', { list });
})

module.exports.updateListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.data });
    if (typeof req.file != 'undefined') {
        const url = req.file.path;
        const filename = req.file.filename;
        list.image = { url, filename };
        await list.save()
    }
    req.flash('success', 'List updated!');
    res.redirect(`/listings/${id}`);
})

module.exports.deleteListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findByIdAndDelete(id);
    req.flash('success', 'List deleted!');
    res.redirect('/listings');
})


module.exports.allListing = wrapAsync(async (req, res) => {
    let lists = await Listing.find({})
        .catch((err) => {
            console.log(err);
        });
    res.render('./listings/list', { lists });
})

module.exports.expandList = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'owner' } }).populate('owner');
    if (!list) {
        req.flash("error", "List doesn't exist!");
        res.redirect(`/listings`);
    }
    res.render('./listings/show', { list });
})