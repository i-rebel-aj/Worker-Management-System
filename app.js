const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require("connect-flash");
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect(process.env.DB_Production, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    console.log("Connected to mongoDB")
}).catch((err)=>{
    console.log(err)
})
//Middle wares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(flash());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use(methodOverride("_method"));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'shhhh, very secret lubba wubba dubba etc'
}));

app.use(function(req, res, next) {
    if (req.session.isLoggedIn) {
        res.locals.currentUser = req.session.user;
    } else {
        res.locals.currentUser = null;
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Requiring Routes
const authRoutes=require('./routes/auth')
const managerRoutes=require('./routes/manager')
const taskRoutes=require('./routes/tasks')
app.get('/', (req, res)=>{
    res.render('home')
})

app.use('/user/auth', authRoutes)
app.use('/manager', managerRoutes)
app.use('/task', taskRoutes)
app.get('*', (req, res)=>{
    res.render('error')
})

app.listen(process.env.PORT, ()=>{
    console.log(`The Server has started at port ${process.env.PORT}`)
})