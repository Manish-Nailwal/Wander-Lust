require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
// const dbUrl = 'mongodb://127.0.0.1:27017/WanderLust';             //for local Database
const dbUrl=process.env.ATLAS_URL;                                  //for cloud database
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoStore = require('connect-mongo');


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 7*24*60*60,
})

const sessionOption={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+1*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

const reviewRoute = require('./routes/reviews');         
const listingRoute = require('./routes/listing');
const userRoute = require('./routes/user');
const otherRoute = require('./routes/others');

const engine = require('ejs-mate');
app.engine('ejs', engine);


app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log('Connection Successful');
    })
    .catch((err) => {
        console.log(err);
        console.log('Connection Failed');
    });

//Api requests



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
})



app.use('/listings/:id/review',reviewRoute);
app.use('/listings',listingRoute);
app.use('/',userRoute);
app.use('/',otherRoute);



app.use((err,req,res,next)=>{
    let {status=500,message='Error'} = err;
    res.render('err',{message});
})

// Start the server
app.listen(8081, () => {
    console.log('listening...');
});