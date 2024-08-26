require('dotenv').config();

const express = require('express');                           //Express import
const expressLayout = require('express-ejs-layouts'); 
const methodOveride = require('method-override');
const cookieParser = require('cookie-parser');        // Express layout import
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const session = require('express-session');
const flash = require('connect-flash');
const { isActiveRoute } = require('./server/helpers/routeHelpers')

//Used express to set up a http port/app
const app = express();
const PORT = 3000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOveride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: {maxAge : new Date ( Date.now()+ (36000000))}
}))
app.use(flash());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});



app.use(express.static('public'));                           //Pages that can be accessible for the user

// Template Engine Middleware
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute ;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`);

});
