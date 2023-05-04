const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const randomstring  = require('randomstring')
const nodeMailer = require("nodemailer")
const config = require("../config/config")
const productModel = require('../models/product')
const couponModel = require('../models/coupon')
const cartModel = require('../models/cart')
const { editProduct } = require('./productController')
const userModel = require('../models/userModel')
const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const orderModel = require('../models/orders')

let message;
let discountField;

const securePassword = async(password)=> {
    try {

       const passwordHash = await bcrypt.hash(password,10);

       return passwordHash

    } catch (error) {
        console.log(error.message);
    }
}

//:::::::::::::::::::::::::::::::::::::::::::for send mail :::::::::::::::::::::::

const sendVerifyMail = async(name,email,user_id)=>{
    try {

        const transporter = nodeMailer.createTransport({

            host:'smtp.gmail.com',
            port:465,
            secure:true,
            require:true,
            auth:{
                user:'firstprojectest1@gmail.com',
                pass : 'uajclcphlfmiroll'

            }
        })

        const mailOptions = {

            from : 'firstprojectest1@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hii '+name+', please click here to <a href="https://urbanshopping.online/verify?id='+user_id+'">Verify</a> your mail.</p>'

        }

        transporter.sendMail(mailOptions, function(error,info){

            if(error){

                console.log(error);

            }else{
                console.log("Email has been sent :- ",info.response);
            }

        })
        
    } catch (error) {

        console.log(error.message);
    }
}
 

//:::::::::::::::::::::::::::::::::::Register:::::::::::::::::::::::::::::::::::::::::

const loadRegister = async(req,res)=>{
    try {

        res.render('registration')

    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    
    try {
        const {name,email,mno,pass}=req.body

        const userData=await User.findOne({email:email})
        
      if (name.trim()==='') {

        res.render('registration',{message: "Please enter currectly"});

      }else if(userData){

            if(email==userData.email){

                res.render('registration',{message: "already exists"});

            }
      } else {

        const SPassword = await securePassword(req.body.pass);

        const user = new User({
            name:req.body.name,
            email:req.body.email, 
            mobile:req.body.mno,
            password:SPassword,
            is_admin: 0

        })
        const userData = await user.save();

        if(userData){

            sendVerifyMail(req.body.name,req.body.email, userData._id);

            res.render('registration',{message: "Your registration has been succesfully completed,please check your email to verify"});

        }else{
            res.render('registration',{message: "Your registration has been failed"});
        }
      }
    } catch (error) {
        console.log(error.message);
    }
}


//:::::::::::::::::::::::::::::::::Login:::::::::::::::::::::::::::::::::::::::

const loginLoad = async(req,res)=>{
    try {

        res.render('login')

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const Email = req.body.email

        const password = req.body.password

       const userData = await User.findOne({email:Email}) 

       if(userData && userData.is_blocked==0){

            const matchPassword = await bcrypt.compare(password,userData.password)

            if(matchPassword){
                
                req.session.user_id = userData._id
                
                 res.redirect('/home')
                
            }else{
                res.render('login',{message : "password is incurrect"});
            }

       }else{
        res.render('login',{message : "email and password is incurrect"})
       }
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try {
        const productData = await productModel.find({is_flaged : 0})

        const session = req.session.user_id
        
        const bannerData = await bannerModel.find({});

        const bannerOne = bannerData.filter(element => element.flag === 1);
        const bannerTwo = bannerData.filter(element => element.flag === 2);

        const userData = await User.findOne({_id : session})

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        res.render('home',{product : productData,session,cartData,message,userData,bannerOne,bannerTwo})
        message = null;


    } catch (error) {
        console.log(error.message);
    }
}

const  userLogout= async(req,res)=>{
    try {

        req.session.user_id = null;

        res.redirect('/')

    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async(req,res)=>{
    try {
        
        const updateInfo = await User.updateOne({_id:req.query.id},{$set :{is_verified : 1}})

        res.render("email-verified")

    } catch (error) {
        console.log(error.message);
    }
}

//::::::::::::::::::::forget password start:::::::::::


const sendResetPasswordMail = async(name,email,token)=>{
    try {

        const transporter = nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            require:true,
            auth:{
                user:'firstprojectest1@gmail.com',
                pass : 'uajclcphlfmiroll'
            }
        })

        const mailOptions = {
            from : 'firstprojectest1@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hii '+name+', please click here to <a href="http://localhost:5000/forget-password?token='+token+'">reset your password</a></p>'
        }

        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("Email has been sent :- ",info.response);
            }
        })
        
    } catch (error) {

        console.log(error.message);
    }
}
 

const forgetLoad = async(req,res)=>{
    try {

       res.render('forget')

    } catch (error) {
        console.log(error.message);
    }
}


const forgetVerify = async(req,res)=>{

    try {

     const email = req.body.email;
     const userData = await User.findOne({email:email})

     if(userData){

         const randomString = randomstring.generate()
      
         await User.updateOne({email:email},{$set:{token : randomString}});

         sendResetPasswordMail(userData.name,userData.email,randomString)

         res.render('forget',{message: "please check your mail to reset your password"});

     }else{

         res.render('forget',{message : "user name does not exist"})
     }
    
     } catch (error) { 
         console.log(error.message)
     }
}


const forgetPasswordLoad = async(req,res)=>{
    try {

        const token = req.query.token
        const tokenData = await User.findOne({token : token});

        if(tokenData){
            res.render('forget-password',{user_id: tokenData._id})

        }else{
            res.render('404',{message: "Token is invalid"})
        }

    } catch (error) {
        console.log(error.message);
    }
 }


 const resetPassword = async(req,res)=>{
    try {
        
        const password = req.body.password;
        const user_id = req.body.user_id
        const secure_password = await securePassword(password)
    
        await User.findByIdAndUpdate({_id:user_id},{$set : {password : secure_password, token :''}})

        res.redirect("/")

    } catch (error) {
        console.log(error.message);
    }

 }

 //:::::::::::::::::::Product::::::::::::

 const productView = async(req,res)=>{

    try {
        const session = req.session.user_id
        const id = req.query.id
        
        //const product = await productModel.findOne({_id : id}).populate('category')

        const product = await productModel.findOne({_id: id})
        .populate('category')
        .populate({ 
            path: 'user_review.user',
            model: 'user' 
        }); 

        const category = await categoryModel.find({})

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        res.render('product-view',{product,session,cartData,message,category})
        message = null

    } catch (error) {
        console.log(error.message);
    }

 }


 const productLoad = async(req,res)=>{

    try {

        const session = req.session.user_id

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const category = await categoryModel.find({})

        let product;
        let gender = null;

        if(req.query.category || req.query.genter){

            if(req.query.category && req.query.genter){

                const categoryData = await categoryModel.findOne({name : req.query.category})
    
                product = await productModel.find({category : categoryData._id,gender : req.query.genter})

            }
            else if(req.query.category){
                
                const categoryData = await categoryModel.findOne({name : req.query.category})

                if(req.query.category=='BAGS'){

                    const bagAndHandbag = await categoryModel.findOne({name : 'HANDBAGS'})

                    product = await productModel.find({$or:[{category : categoryData._id},{category : bagAndHandbag._id}]})

                }else{

                    product = await productModel.find({category : categoryData._id})

                }

            }else if(req.query.genter){

                product = await productModel.find({gender : req.query.genter})

                gender =  req.query.genter;

            }
            res.render('products',{session,cartData,product,category,gender})

        }else{
        
        product = await productModel.find({})
            
        res.render('products',{session,cartData,product,category,gender})

        }

    } catch (error) {

        console.log(error);

    }
 }


 const productFilter=async(req,res)=>{
    try{
       
        const category = req.body.category
        const sort = req.body.sort
        const search = req.body.search 
        const gender = req.body.gender

        let products;

        if(!category && !sort && !search){
            products = await productModel.find({is_flaged: 0,    
                $or: [
                        { gender: gender },
                        { gender: "Unisex" }
                        ]}).populate('category');
                        }
        else if(category && sort && search){
            if(category === 'all'){
                if(sort === 'highToLow'){
                    products = await productModel.find(
                        { name: { $regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        ,is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }
                                    ).sort({ price: -1 }).populate('category');
                        
                }else if(sort === 'lowToHigh'){
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        , is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category'); 
                                }else if(sort === 'all'){
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        , is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                                }else {
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        , is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                                }
            }else{
                if(sort === 'highToLow'){
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        ,category: category, is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:-1}).populate('category'); 

                }else if(sort === 'lowToHigh'){
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        ,category: category, is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category'); 
                                }else if(sort === 'all'){
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        ,category: category, is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                                }else {
                    products = await productModel.find(
                        {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                        ,category: category, is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                                }
            }
        }
        else if(!category && !sort && search){

                products = await productModel.find({name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                ,is_flaged: 0,    
                $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category');

        }
        else if (!category && sort && !search){

            if(sort === 'highToLow'){
                products = await productModel.find(
                    {is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:-1}).populate('category');

            }else if(sort === 'lowToHigh'){
                products = await productModel.find(
                    { is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category');

            }else if(sort === 'all'){
                products = await productModel.find(
                    { is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category');
                            }else {
                products = await productModel.find(
                    {is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                            } 
        }
        else if(category && !sort && !search){
            if(category === 'all'){
                products = await productModel.find(
                    { is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                            }else{
                products = await productModel.find(
                    {category: category, is_flaged: 0,    
                        $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category'); 
                            }
        }
        else if(category && sort && !search){
            if(category != 'all'){
                if(sort === 'highToLow'){
                    products = await productModel.find(
                        {category: category, is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:-1}).populate('category');
                    
                }else if(sort === 'lowToHigh'){
                    products = await productModel.find(
                        {category: category, is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category');
                    
                }else if(sort === 'all'){
                    products = await productModel.find(
                        {category: category, is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category');
                                }else {
                    products = await productModel.find(
                        {category: category , is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                                }
            }else{
                if(sort === 'highToLow'){
                    products = await productModel.find(
                        { is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:-1}).populate('category');
                    
                }else if(sort === 'lowToHigh'){
                    products = await productModel.find(
                        { is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category');
                    
                }else if(sort === 'all'){
                    products = await productModel.find(
                        { is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category');
                                }else {
                    products = await productModel.find(
                        { is_flaged: 0,    
                            $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                                }
            }
        }
        else if(!category && sort && search){

            if(sort === 'highToLow'){
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b', $options: 'i' }
                    , is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                          ] }).sort({price:-1}).populate('category');

            }else if(sort === 'lowToHigh'){
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b',$options: 'i' }
                    , is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).sort({price:1}).populate('category');

            }else if(sort === 'all'){
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b',$options: 'i' }
                    , is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ] }).populate('category');
                            }else {
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b',$options: 'i' }
                    , is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                            }

        }else if(category && !sort && search){
            if(category === 'all'){
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b',$options: 'i' }
                    , is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                            }else{
                products = await productModel.find(
                    {name: {$regex: '\\b' + search.replace(/\s+/g, '\\s+') + '\\b',$options: 'i' }
                    ,category:category, is_flaged: 0,    
                    $or: [
                            { gender: gender },
                            { gender: "Unisex" }
                        ]  }).populate('category');
                            }
        }
        res.send({success:true,products})

    }catch(err){
        console.log(error.log);
    }
}


const addReview = async(req,res)=>{
    try {
        const productId = req.body.productId

        const orderId =req.body.orderId

        const reviewText = req.body.reviewText

        const exist =  await productModel.findOne({_id : productId,'user_review.user':req.session.user_id})
        
        if(!exist){

            const product = await productModel.updateOne({_id : productId},{$push : {user_review :{user : req.session.user_id,review : reviewText}}})

            if(product) await orderModel.findOneAndUpdate({user : req.session.user_id ,'order._id' : orderId},{'order.$.is_reviewed' : true})

            if(product){
                const responseData = {
                    success: true,
                    message:'Thankyou for your Review',
                    reviewText : reviewText,
                    newReview : true
                  };
                res.json(responseData);
            }

        }else{

            const product = await productModel.findOne({_id : productId})

            const index = product.user_review.findIndex(value => value.user.equals( req.session.user_id))

            product.user_review[index].review = reviewText 
            
            await product.save()

            if(product){
            const responseData = {
                success: true,
                message:'Succesfully updated your Review',
                reviewText : reviewText,
                newReview : false
              };
            res.json(responseData);
            }
         }
    } catch (error) {
        console.log(error.message);
    }
 }


 const  addRating = async(req,res)=>{

    try {
        const productId = req.query.id

        const data =await productModel.findOne({_id : productId,'user_rating.user':req.session.user_id})


        if(!data){

            await productModel.updateOne({_id: productId },{ $push:{user_rating:{user: req.session.user_id, rating: req.query.rating }}});

            const productData = await productModel.findOne({_id : productId})



            let rating = productData.user_rating.map((value)=>value.rating).reduce((total,value)=>{return total = total+value},0)

            const avgRating = rating / productData.user_rating.length; 

            const roundedRating = Math.round(avgRating)
            
            await productModel.updateOne({ _id: productId },{$set: {rating: roundedRating}});
                    

            const responseData = {
                success: true,
                message:'Thankyou for Rating',
                rating : req.query.rating
              };

            res.json(responseData);

        }else{

          let productData = await productModel.findOne({_id : productId})

          const index = productData.user_rating.findIndex(value => value.user.equals(req.session.user_id))

          productData.user_rating[index].rating = req.query.rating

          await productData.save()

          let product = await productModel.findOne({_id : productId})

          let rating = product.user_rating.map((value)=>value.rating).reduce((total,value)=>{return total = total+value},0)

          const avgRating = rating / productData.user_rating.length; 
          
          const roundedRating = Math.round(avgRating)

          await productModel.updateOne({ _id: productId },{$set: {rating: roundedRating}});

          const responseData = {
            success: true,
            message:'Thankyou for Rating,Your Rating is Updated',
            rating : req.query.rating
          };

        res.json(responseData);
     }
    } catch (error) {
        console.log(error);
    }

 }


 //::::::::::::::::::Checkout:::::::::::::::

const checkOut = async(req,res)=>{

    try {

        const session = req.session.user_id 
        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const user = await User.findOne({_id : session})

        if(cartData){
            const outOfStock = cartData.item.map((value)=>value).filter((value)=>{
                return value.product.stock < 1
            })
            if(outOfStock.length!=0){

                res.redirect('/view-cart')

            }else{

            const coupon = await couponModel.find({'users.user':{$ne:session}})
                
            res.render('checkout',{session,cartData,user,coupon,discountField})

            }

        }else{

            res.redirect('/view-cart')

        }
    } catch (error) {
        console.log(error);
    }
}

//:::::::::::::::::::COUPON::::::::::::::::::::::::::::

const addCoupon = async(req,res)=>{

    try {

        const session = req.session.user_id
        const couponCode =  req.body.couponCode

        const coupon = await couponModel.findOne({couponCode : couponCode})
        const userCart = await cartModel.findOne({user : session})
        
        const couponDiscount = (coupon.discount / 100)

        if (coupon) {

            if (userCart.totalPrice >= coupon.minPurchaseAmount) {

                if (userCart.totalPrice * couponDiscount > coupon.maxDiscountAmount) {

                    const grand = coupon.maxDiscountAmount

                    if(userCart.couponID) await couponModel.updateOne({_id :userCart.couponID},{ $pull: { users: { user: session } } })  
                    
                    await cartModel.updateOne({user:session},{$set:{couponDiscount:grand,couponID:coupon._id}})
                    await couponModel.updateOne({couponCode :couponCode},{$push :{users :{user:session}}})
                    
                    res.redirect('/check-out')

                }else{

                     const grand = userCart.totalPrice * couponDiscount

                     if(userCart.couponID) await couponModel.updateOne({_id :userCart.couponID},{ $pull: { users: { user: session } } })  

                     await cartModel.updateOne({user:session},{$set:{couponDiscount:grand,couponID:coupon._id}})

                     await couponModel.updateOne({couponCode :couponCode},{$push :{users :{user:session}}})

                    res.redirect('/check-out')
               
                }
                
            }else{

                message = "minimum purchase not met"

                console.log(message);

            }
        }else {

            message = "coupon expired or not valid"

            console.log(message);
        }

        
    } catch (error) {
        console.log(error.message);
    }
}




//:::::::::::::::::::::ADD ADDERESS::::::::::::

const addAddress = async(req,res)=>{

    try {
        
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const house = req.body.house
        const landMark = req.body.landMark
        const city = req.body.city
        const state = req.body.state
        const pinCode = req.body.pinCode
        const phone = req.body.phone

        await User.updateOne({_id : req.session.user_id},{$push :{ address : {
            firstName : firstName,
            lastName : lastName ,
            house : house,
            landMark : landMark,
            city : city,
            state : state,
            pinCode : pinCode,
            phone : phone
          }}})

          res.redirect('/check-out')

    } catch (error) {
        console.log(error.message);
    }
}

//::::::::::::::::::Payment:::::::::::::


const payment = async(req,res)=>{

    try {
        const session = req.session.user_id

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const user = await User.findOne({_id : req.session.user_id})
        
        const index = req.body.index
       
        const billAddress = user.address[index]

        req.session.billAddress = billAddress
        
        res.render('payment',{session,cartData,user,message})

        message =null;
        
         
    } catch (error) {
        console.log(error.message);
    }



}


//:::::::::::::::::::::WishList:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


const wishListLoad = async(req,res)=>{

    try {

        const session = req.session.user_id

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const user = await userModel.findOne({_id : req.session.user_id}).populate('wishlist.product')

        res.render('wishlist',{session,cartData,user,message})
        message=null;
        
    } catch (error) {
        console.log(error.message);
    }
}


const addToWishliat = async(req,res)=>{

    try {
        
        const productId = req.query.id

        const user = req.session.user_id

        const userData = await userModel.findOne({_id : user})

        let Data = null;
        userData.wishlist.forEach(element => {

           if(element.product == productId){
                Data=true;
           }

        });

        if(Data){

            const responseData = {
                success: true,
                message:'Already existed wishlist'
              };
            res.json(responseData);

        }else{

            await userModel.updateOne({_id:user},{$push:{wishlist:{product : productId}}})

            const responseData = {
                success: true,
                message:'Added to wishlist'
              };
            res.json(responseData);
        }
    
    } catch (error) {
        console.log(error.message);
    }
}


const removeFromWishlist = async(req,res)=>{

    try {
        
        const productId = req.query.id

        const product = await productModel.findOne({_id:productId})

        const user = req.session.user_id
        
        await userModel.updateOne({_id:user},{$pull:{wishlist:{product : productId}}})

        const responseData = {
            success: true,
            message:'removed from wishlist'
          };
        res.json(responseData);
        
    } catch (error) {
        console.log(error.message);
    }
}

//:::::::::::::::::::::::::::::::USER-PROFILE::::::::::::::::::::

const userProfile = async(req,res)=>{

    try {

        const session = req.session.user_id

        message = null

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const user = await userModel.findOne({_id : session})
        
        res.render('profile',{session,cartData,user,message})

    } catch (error) {
        console.log(error.message);
    }


}

const changePass = async(req,res)=>{
    try {

        const userData =  await User.findOne({_id : req.session.user_id})
      
        const matchPassword = await bcrypt.compare(req.body.currentPass,userData.password)

        if(matchPassword){

            const Hashpass = await securePassword(req.body.newPass);

            await User.updateOne({_id : req.session.user_id},{$set :{password  : Hashpass}})

            const response={
                message : "Password changed succesfully",
                success : true
            }

            res.json(response)

        }else{
  
            const response = {
                success : false,
                message : "Entered wrong password"
            }
            res.json(response)
        }

    } catch (error) {
        console.log(error.message);
    }
}

const deleteAddress = async(req,res)=>{

    try {
        console.log("Enmtered to controller");
        const userId = req.session.user_id

        const addressId = req.query.id
        console.log(addressId);

        await User.updateOne({_id : userId},{$pull : {address:{_id : addressId}}})

            const response = {
            success : true,
            message : "Adress removed successfully"
            }

            res.json(response)
        
    } catch (error) {
        console.log(error.message);
    }

}

let editIndex ;

const editAddress = async(req,res)=>{

    try {
        
        const addressId = req.query.id

        editIndex = req.query.index

        const session = req.session.user_id

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const userData = await User.findOne({_id : session})

        const address = userData.address[editIndex]
        
        res.render('edit-address',{session,cartData,address})

    } catch (error) {
        console.log(error.message);
    }
}

const updateAddress = async(req,res)=>{

    try {
        
        const index = editIndex

        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const house = req.body.house
        const landMark = req.body.landMark
        const city = req.body.city
        const state = req.body.state
        const pinCode = req.body.pinCode
        const phone = req.body.phone

         const user = await User.findOne({_id : req.session.user_id})

         user.address[index].firstName = firstName
         user.address[index].lastName = lastName 
         user.address[index].house = house 
         user.address[index].landMark = landMark
         user.address[index].city = city
         user.address[index].state = state
         user.address[index].pinCode = pinCode
         user.address[index].phone = phone
         user.save()

       
        res.redirect('/user-profile')

    } catch (error) {
        console.log(error.message);
    }


}





module.exports = {
    //::::::::LOGIN,HOME:::::::
    loadRegister,
    verifyMail,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout, 

    //:::::::::FORGET::::::::::
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,

    //::::::PRODUCT::::::::::::
    productView,
    productLoad,
    productFilter,
    addReview,
    addRating,

    //:::::CHECKOUT::::::::::::
    checkOut,
    addAddress,
    payment,

    //::::WISHLIST:::::::::::::
    wishListLoad,
    addToWishliat,
    removeFromWishlist,

    //::::USER-PROFILE::::::::
    userProfile,
    changePass,
    deleteAddress,
    editAddress,
    updateAddress,

    //::::::::COUPON::::::::
    addCoupon

}