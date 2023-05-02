const express = require('express')
const admin_route = express();
const path = require('path')
const session = require('express-session');
const nocache =require('nocache')
const env = require('dotenv').config()
const bodyParser = require('body-parser');
const adminController = require('../controllers/adminController') 
const categoryController=  require('../controllers/categoryController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const bannerController = require('../controllers/bannerController')
const auth = require('../middleware/adminAuth')
const multer = require('../middleware/multer')

admin_route.use(session({secret:process.env.sessionSecret}))
admin_route.use(nocache())
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');


admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.get('/admin',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin)

admin_route.get('/logout',auth.isLogin,adminController.adminLogout)

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)

//::::::::USERS::::::::::::::::

admin_route.get('/users',auth.isLogin,adminController.adminUsers)

admin_route.get('/new-user',auth.isLogin,adminController.addUserLoad)

admin_route.post('/new-user',adminController.addUser)   

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)

admin_route.post('/edit-user',adminController.updateUser)

admin_route.get('/delete-user',auth.isLogin,adminController.deleteUser)

admin_route.get('/block-user',auth.isLogin,adminController.blockUser)

admin_route.get('/unblock-user',auth.isLogin,adminController.unblockUser)

//:::::::::::::::::::CATERGORY::::::::::::::::::::::::

admin_route.get('/category',auth.isLogin,categoryController.loadCategory)

admin_route.get('/add-category',auth.isLogin,categoryController.newCategoryLoad)

admin_route.post('/add-category',categoryController.addCategory)

admin_route.get('/edit-category',auth.isLogin,categoryController.editCategoryload)

admin_route.post('/edit-category',auth.isLogin,categoryController.editCategory)

admin_route.get('/delete-category',auth.isLogin,categoryController.deleteCategory)

admin_route.get('/list-category',auth.isLogin,categoryController.listCategory)

admin_route.get('/unlist-category',auth.isLogin,categoryController.unlistCategory)


//::::::::::::::::::::PRODUCTS::::::::::::::::::::::::::

admin_route.get('/products',auth.isLogin,productController.productLoad)

admin_route.get('/add-product',auth.isLogin,productController.addProductLoad)

admin_route.post('/add-product',multer.uploadMulter.array('images',5),productController.addProduct)

admin_route.get('/image-remove',auth.isLogin,productController.imageRemove)

admin_route.get('/edit-product',auth.isLogin,productController.editProductload)

admin_route.post('/edit-product',multer.uploadMulter.array('images',5),productController.editProduct)

admin_route.get('/delete-product',auth.isLogin,productController.deleteProduct)

admin_route.get('/flag-product',auth.isLogin,productController.flagProduct)

admin_route.get('/unflag-product',auth.isLogin,productController.unflagProduct)

admin_route.get('/delete-product',auth.isLogin,productController.deleteProduct)


//::::::::::::::::::ORDERS::::::::::::::::::::::::::

admin_route.get('/orders',auth.isLogin,orderController.ordersLoad)

admin_route.get('/order-details',auth.isLogin,orderController.orderDetails)

admin_route.post('/change-status',auth.isLogin,orderController.changeStatus)

admin_route.get('/approve-refund',auth.isLogin,orderController.approveRefund)


//:::::::::::::::::::COUPON::::::::::::::::::::

admin_route.get('/coupon',auth.isLogin,couponController.couponLoad)

admin_route.get('/add-coupon',auth.isLogin,couponController.addCouponLoad)

admin_route.post('/add-coupon',auth.isLogin,couponController.addCoupon)

admin_route.delete('/delete-coupon',auth.isLogin,couponController.deleteCoupon)

admin_route.get('/edit-coupon',auth.isLogin,couponController.editCouponLoad)

admin_route.post('/edit-coupon',auth.isLogin,couponController.editCoupon)

//:::::::::::::::;:::BANNER::::::::::::::::::::::::::

admin_route.get('/banner',auth.isLogin,bannerController.bannerLoad)

admin_route.post('/add-banner',auth.isLogin,multer.uploadMulter.array('image',1),bannerController.addBanner)

admin_route.get('/banner-delete',auth.isLogin,bannerController.deleteBanner)

admin_route.post('/banner-edit',auth.isLogin,multer.uploadMulter.array('image',1),bannerController.editBanner)

admin_route.post('/banner-apply',auth.isLogin,bannerController.applyBanner)


//::::::::::::::::::::SALES-REPORT::::::::::::::::::::::::::::

admin_route.get('/sales-report',auth.isLogin,adminController.salesReportLoad)

admin_route.post('/sales-report',auth.isLogin,adminController.salesReportLoad)

//-------------------------------------------------------------------------------------------


module.exports = admin_route
 











