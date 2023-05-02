const { hash } = require('bcrypt')
const mongoose=require('mongoose')
const orderShema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    address:{
        type:Object,
        require:true
    },
    order:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        price :{
            type : Number,
            require : true
        },
        quantity:{
            type:Number,
            require:true
        },
        total:{
            type:Number,
            require:true
        },
        status:{
            type:String,
            require:true,
            default:'Order Confirmed'
        },
        paymentMethod:{
            type:String,
            require:true
        },
        date:{
            type:Date,
            require:true
        },
        arriveDate:{
            type:String,
            require:true
        },
        is_reviewed : {
            type : Boolean,
            default : false
        }
    }],
    grantTotal : {
        type : Number,
        require : true
    },
    couponDiscount :{
        type: Number,
        default : 0
    },
    couponId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'coupon'
    }
 
})
module.exports=mongoose.model('order',orderShema)