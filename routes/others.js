const express = require('express');
const router = express.Router();
const controller = require('../controllers/others');
const ExpressError = require('../util/ExpressError');


router.get('/zoom/:id', controller.zoom);

router.get('/search', controller.search);

router.get('/:id',controller.filter)

router.get('/', controller.home);


module.exports=router;