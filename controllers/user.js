const { wrapAsync } = require('../util/wrapAsync');
const User = require('../models/user');

module.exports.renderSignupPage=(req, res) => {
    res.render('./user/signup');
}


module.exports.signupUser=wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const regUser = await User.register(newUser, password);
        req.login(regUser, (e) => {
            if (e) {
                next(e);
            }
            req.flash('success', 'User Sign up successfully');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', `${e.message}`);
        res.redirect('/signup');
    }
})

module.exports.renderLoginPage=(req, res) => {
    res.render('user/login');
}

module.exports.loginUser=wrapAsync(async (req, res) => {
    let { username } = req.body;
    req.flash('success', `Welcome ${username}`);
    let redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl);
})

module.exports.logoutUser=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logout!');
        res.redirect('/');
    })
}