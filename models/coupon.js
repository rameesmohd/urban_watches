const mongoose=require('mongoose')

const couponSchema = mongoose.Schema({

    couponCode:{
        type:String,
        uppercase : true,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    expiryDate :{
        type : Date,
        required : true
    },
    minPurchaseAmount : {
        type: Number,
        required : true
    },
    discount:{
        type: Number,
        required : true
    },
    status :{
        type : Boolean,
        default : true
    },
    maxDiscountAmount:{
        type: Number,
        required : true
    },
    noOfCoupon:{
        type: Number,
        required : true
    },
    users:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    }
    ]

})

module.exports = mongoose.model('coupon',couponSchema)