const orderModel = require('../models/orders')
const userModel = require('../models/userModel')



const ordersLoad = async(req,res)=>{

    try {

        const orders = await orderModel.find({})      
        res.render('orders',{orders})

    } catch (error) {
        console.log(error.message);
    }
}



const orderDetails = async(req,res)=>{

    try {
        
        const orderId = req.query.id

        req.session.temp = orderId

        const orderData = await orderModel.findOne({_id : orderId}).populate('order.product').populate({
            path : 'order.product',
            populate : 'category'
        })

        res.render('order-details',{orderData})

    } catch (error){
        console.log(error.message);
    }
}


const changeStatus = async(req,res)=>{

    try {
        const orderId = req.body.orderId

        await orderModel.updateOne({'order._id':orderId},{$set : {'order.$.status' : req.body.option}})

        //-----------------------------------------------------------------------------------------------
        const orderData = await orderModel.findOne({_id : req.session.temp}).populate('order.product').populate({
            path : 'order.product',
            populate : 'category'
        })
        res.render('order-details',{orderData})
        //------------------

    } catch (error) {
        console.log(error.messsage);
    }
}


const approveRefund = async(req,res)=>{

    try {
    
    const orderId = req.query.id

    const orderList = await orderModel.findOne({'order._id' : orderId})

    const order =  orderList.order.map((value)=>value).filter((value)=>value._id==orderId)

    const user = await userModel.findOne({_id : orderList.user})


    await userModel.updateOne({_id : orderList.user},{ $set :{ wallet : order[0].total+user.wallet}})

    await orderModel.updateOne({'order._id' : orderId},{$set : {'order.$.status' : 'Refund Approved'}})

    //-------------------------------------------------------------------------------------------------------------
    const orderData = await orderModel.findOne({_id : req.session.temp}).populate('order.product').populate({
        path : 'order.product',
        populate : 'category'
    })
    res.render('order-details',{orderData})
    //---------------

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    ordersLoad,
    orderDetails,
    changeStatus,
    approveRefund
}