const mongoose =require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required :true 
    },
    mobile : {
        type : String,
        required :true 
    },
    password : {
        type : String,
        required :true 
    },
    address :[{

        firstName :{
            type : String,
            required : false
        },
        lastName :{
        type: String,
        required : false
        },
        house :{
        type : String,
        required : false
        },
        landMark : {
        type : String,
        required : false
         },
        city :   {
        type : String,
        required : true
         },
        state : {
            type : String,
            required : false
        },
        pinCode : {
            type : Number,
            required : false
        },
        phone : {
            type : Number,
            required : false
        }
}],
    is_admin : {
        type : Number,
        required : true
    },
    is_verified:{
        type : Number,
        default : 0
    },
    token:{
        type:String,
        default:''
    },
    is_blocked:{
        type: Number,
        default : 0
    },
    wallet:{
        type: Number,
        default : 0
    },
    wishlist:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        }
    }]
   
})

module.exports =  mongoose.model('user',userSchema)