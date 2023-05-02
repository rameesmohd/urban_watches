const express = require('express')
const errorRoute = express()

errorRoute.set('views','./views/users')
errorRoute.set('view engine','ejs')


errorRoute.get('*',(req,res)=>{
    res.render('404')
})


module.exports = errorRoute