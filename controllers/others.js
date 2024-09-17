const { wrapAsync } = require("../util/wrapAsync");
const Listing = require('../models/listing');
const ExpressError = require("../util/ExpressError");

module.exports.zoom = wrapAsync(async (req, res) => {
    const { id } = req.params;
    let redirect = req.rawHeaders[27];
    const data = await Listing.findById(id);
    res.render('listings/zoom', { data, redirect });
})

module.exports.search = wrapAsync(async (req, res) => {
    const query = req.query.q;
    let lists = await Listing.find({});
    let newList = [];
    for (list of lists) {
        if (list.title.toLowerCase().includes(query.toLowerCase()) || list.location.toLowerCase().includes(query.toLowerCase()) || list.country.toLowerCase().includes(query.toLowerCase()) || list.category.includes(query.toLowerCase())) {
            newList.push(list);
        }
    }
    if (newList.length) {
        lists = newList;
        res.render('listings/list', { lists });
    } else {
        req.flash('error', 'match not found! T_T');
        res.redirect('/listings');
    }

})

module.exports.home = (req, res) => {
    res.redirect('/listings');
}



module.exports.filter = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let filter = ['mountain', 'pool', 'outing', 'nature', 'room', 'hotel', 'beach'];
    if (filter.includes(id.toLowerCase())) {
        let lists = await Listing.find({});
        let newList = [];
        for (list of lists) {
            if (list.title.toLowerCase().includes(id.toLowerCase()) || list.description.toLowerCase().includes(id.toLowerCase()) || list.category.includes(id.toLowerCase())) {    //|| list.category.toLowerCase().includes(id.toLowerCase())
                newList.push(list);
            }
        }
        if(newList.length){
            lists = newList;
            res.render('listings/filter', { lists });
        }else{
            req.flash('error', 'match not found! T_T');
            res.redirect('/listings');
        }

    } else {
        throw new ExpressError(404, 'Page not found');
    }


})