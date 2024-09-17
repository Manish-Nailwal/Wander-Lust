const express = require('express');
const router = express.Router();
const passport = require('passport');
const { redirectUrl } = require('../util/middleware');
const userController = require('../controllers/user')

router.route('/signup')
    .get(userController.renderSignupPage)  //signup form
    .post(userController.signupUser);   //signup user


router.route('/login')
    .get(userController.renderLoginPage)   //login form
    .post(redirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.loginUser);  //login user

router.get('/logout', userController.logoutUser)    //logout User

module.exports = router;