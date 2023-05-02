const mongoose = require('mongoose')
const logger = require('morgan')
const env = require('dotenv').config()
const express = require("express");
const app = express();
const path = require('path')

mongoose.connect(process.env.url)

//app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
  });

//for user routes
const userRoute = require("./routes/userRoute");
app.use("/",userRoute)

//for admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin",adminRoute)

//for 404 errors
const errorRoute = require('./routes/errorRoute')
app.use("/",errorRoute)

app.listen(process.env.port,()=>{
    console.log("Server started...");
})







