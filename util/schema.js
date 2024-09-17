const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    data: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    })
})

module.exports.reviewSchema = Joi.object({
    data: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        feedback: Joi.string().required()
    })
})