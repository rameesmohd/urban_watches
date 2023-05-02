const orderModel = require('../models/orders')
const cartModel = require('../models/cart')
const couponModel = require('../models/coupon')
const userModel = require('../models/userModel')
const productModel = require('../models/product')
const { render } = require('ejs')
const { Session } = require('express-session')


const orderSuccess = async(req,res)=>{
    try {

    if(req.query.method == "cod"){

        const paymentMethod = req.query.method                                               
        const userId = req.session.user_id
        const cartData = await cartModel.findOne({user : userId}).populate('item.product')

        const orderDate = new Date()
        const orderArrivingDate = new Date()
        orderArrivingDate.setDate(orderDate.getDate()+4)

        billAddress = req.session.billAddress

        const orderItem = cartData.item.map((value)=>{
            return{
                product:value.product._id,
                price:value.product.price,
                quantity:value.quantity,
                total:value.price,
                date:orderDate,
                arriveDate : orderArrivingDate,
                paymentMethod:paymentMethod
            }
        })
        const grantTotal = cartData.totalPrice

        await orderModel(
            {
              user : userId,
              order : orderItem,
              grantTotal : grantTotal,
              address : billAddress,
              couponDiscount : cartData.couponDiscount,
              couponId : cartData.couponID
            }
        ).save()

        cartData.item=[]
        cartData.totalPrice=0
        await cartData.save()

        if(cartData.couponID){
                   await cartModel.updateOne({user: req.session.user_id},{$set:{couponID:null,couponDiscount:0}})
               }
        
        res.render('success')

    }else if(req.query.method == "wallet"){

        const paymentMethod = req.query.method                                               
        const userId = req.session.user_id
        const cartData = await cartModel.findOne({user : userId}).populate('item.product')
        const user =await userModel.findOne({_id :userId})

        if(user.wallet >= cartData.totalPrice){

        const orderDate = new Date()
        const orderArrivingDate = new Date()
        orderArrivingDate.setDate(orderDate.getDate()+4)

        billAddress = req.session.billAddress

        const orderItem = cartData.item.map((value)=>{
            return{
                product:value.product._id,
                price:value.product.price,
                quantity:value.quantity,
                total:value.price,
                date:orderDate,
                arriveDate : orderArrivingDate,
                paymentMethod:paymentMethod
            }
        })
        const grantTotal = cartData.totalPrice

        await orderModel(
            {
              user : userId,
              order : orderItem,
              grantTotal : grantTotal,
              address : billAddress,
              couponDiscount : cartData.couponDiscount,
              couponId : cartData.couponID
            }
        ).save()
       
        const discountedTotal = grantTotal-cartData.couponDiscount
        await userModel.updateOne({_id : userId},{ $set :{ wallet : user.wallet-discountedTotal}})

        cartData.item=[]
        cartData.totalPrice=0
        await cartData.save()

        if(cartData.couponID){
            await cartModel.updateOne({user: req.session.user_id},{$set:{couponID:null,couponDiscount:0}})
        }
        
        res.render('success')
        
        }else{
            message = "Insufficient balance"
            const session = req.session.user_id

            const cartData = await cartModel.findOne({user : session}).populate('item.product')
    
            const user = await userModel.findOne({_id : req.session.user_id})
            
            const index = req.body.index
           
            const billAddress = user.address[index]
    
            req.session.billAddress = billAddress
            
            res.render('payment',{session,cartData,user,message})
    
            message =null;
            
        }

    }

    } catch (error) {
        console.log(error.message);
    }


}


const orderStatus = async(req,res)=>{

    try {
        const session = req.session.user_id
        
        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        const orderData = await orderModel.find({ user : session }).populate('order.product')

        res.render('orderStatus',{session,cartData,orderData})

    } catch (error) {
        console.log(error.messsage);
    }
}



const cancelOrder = async(req,res)=>{

    try {
       
        const OrderId =  req.query.id

        const user = req.session.user_id 

        await orderModel.updateOne({user:user,'order._id':OrderId},{$set : {'order.$.status' : "Canceled" }})

        res.redirect('/order-status')

    } catch (error) {
        console.log(error.message);        
    }
}




const returnItem = async(req,res)=>{

    try {
        
    const OrderId = req.query.id

    const user = req.session.user_id

    await orderModel.updateOne({user:user,'order._id':OrderId},{$set : {'order.$.status' : "Requested For Return"}})

    res.redirect('/order-status')    

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    orderSuccess,
    orderStatus,
    cancelOrder,
    returnItem
}