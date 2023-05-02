const mongoose =require("mongoose")

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price:{
        type : Number,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    meterial : {
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'category'
    },
    stock : {
        type : Number,
        required : true
    },
    image : {
        type : Array,
        required : false
    },
    is_flaged : {
        type : Number,
        default : 0
    },
    user_review : [{
        user :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        },
        review:{
            type : String,
            require : true
        }
    }],
    user_rating : [{
        user :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        },
        rating : {
            type : Number,
            require : true,
        }
    }],
    rating : {
        type : Number,
        required : true
    }
})

module.exports =  mongoose.model('product',productSchema)