const mongoose = require('mongoose')
const logger = require('morgan')
const env = require('dotenv').config()
const express = require("express");
const app = express();
const path = require('path')

mongoose.connect(process.env.url).then(res=>{
  console.log(process.env.url);
  console.log('database connected')
})
.catch(err=>{
  console.log('some eror while connecting to database');
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
  });


const userRoute = require("./routes/userRoute");
app.use("/",userRoute)


const adminRoute = require("./routes/adminRoute");
app.use("/admin",adminRoute)


const errorRoute = require('./routes/errorRoute')
app.use("/",errorRoute)

app.listen(process.env.port,()=>{
  console.log(process.env.port);
    console.log("Server started...");
})







