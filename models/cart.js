const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    item: [{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required : true
        },
        name:{
            type : String,
            required : true

        },
        quantity : {
            type : Number,
            required : true,
            default : 1
        },
        price : {
            type  : Number,
            required : true
        }
    }],
    totalPrice : {
        type : Number,
        required : true
    },
    couponDiscount:{
        type:Number,
        require:true,
        default : 0
    },
    couponID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'coupon',
    }
})


module.exports = mongoose.model('cart',cartSchema)