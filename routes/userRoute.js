const express = require('express');
const user_route = express();
const userController = require('../controllers/userController');
const userCartController = require('../controllers/userCartController')
const userOrderController = require('../controllers/userOrderController')
const bodyParser = require('body-parser')
const path = require("path");
const session = require('express-session')
const env = require("dotenv").config()
const auth = require('../middleware/auth')
const blockauth = require('../middleware/blockAuth')
const nocache =require('nocache')

user_route.set('views','./views/users')
user_route.set('view engine','ejs')

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended : true}))
user_route.use(session({secret:process.env.sessionSecret}))
user_route.use(nocache())

//::::::::::::::::::::::::::REGISTER:::::::::::::::::::::

user_route.get("/register",auth.isLogout,userController.loadRegister)

user_route.post("/register",userController.insertUser) 

user_route.get('/verify',userController.verifyMail)

//::::::::::::::::::::::::::HOME:::::::::::::::::::::::::::

user_route.get("/",userController.loadHome)

user_route.get("/login",auth.isLogout,userController.loginLoad)

user_route.post("/login",userController.verifyLogin)

user_route.get('/home',blockauth.isBlocked,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)


//::::::::::::::::::::::::::FORGET-PASSWORD::::::::::::::::::::::::::::::::

user_route.get('/forget',auth.isLogout,userController.forgetLoad)

user_route.post('/forget',userController.forgetVerify)

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad)

user_route.post('/forget-password',userController.resetPassword)


//:::::::::::::::::::::::::::PRODUCTS::::::::::::::::::::::::::::::::::::::::

user_route.get('/product-view',userController.productView)

user_route.get('/product',userController.productLoad)

user_route.post('/productfilter',userController.productFilter)

user_route.post('/submit-review',userController.addReview)

user_route.post('/add-rating',userController.addRating)

//::::::::::::::::::::::::::::CART:::::::::::::::::::::::::::::::::::::::::::

user_route.get('/view-cart',auth.isLogin,userCartController.cartViewLoad)

user_route.get('/addToCart',auth.isLogin,userCartController.addToCart)

user_route.post('/decrement',userCartController.decrement)

user_route.post('/increment',userCartController.increment)

user_route.get('/delete-item',auth.isLogin,userCartController.deleteItem)

user_route.get('/check-out',auth.isLogin,userController.checkOut)

user_route.post('/addAddress',userController.addAddress)

user_route.post('/payment',auth.isLogin,userController.payment)

user_route.get('/order-success',auth.isLogin,userOrderController.orderSuccess)


//::::::::::::::::::::::::::::ORDERS:::::::::::::::::::::::::::::::::::::::

user_route.get('/order-status',auth.isLogin,userOrderController.orderStatus)

user_route.get('/cancel-order',auth.isLogin,userOrderController.cancelOrder)

user_route.get('/return-item',auth.isLogin,userOrderController.returnItem)


//::::::::::::::::::::::::::::::WISHLIST:::::::::::::::::::::::::::::::::::

user_route.get('/wishList',auth.isLogin,userController.wishListLoad)

user_route.get('/add-to-wishlist',auth.isLogin,userController.addToWishliat)

user_route.get('/rmv-wishlist',auth.isLogin,userController.removeFromWishlist)


//:::::::::::::::::::::::::::::::PROFILE:::::::::::::::::::::::::::::::::::

user_route.get('/user-profile',auth.isLogin,userController.userProfile)

user_route.post('/change-pass',auth.isLogin,userController.changePass)

user_route.get('/delete-address',auth.isLogin,userController.deleteAddress)

user_route.route('/edit-address').get(auth.isLogin,userController.editAddress).post(auth.isLogin,userController.updateAddress)

user_route.post('/add-coupon',auth.isLogin,userController.addCoupon)


module.exports = user_route    




