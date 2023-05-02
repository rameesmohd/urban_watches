const mongoose =require("mongoose")

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        uppercase : true,
        required : true
    },
    is_listed : {
        type : Number,
        default : 0
    }
   
})

const categoryModel = mongoose.model('category',categorySchema)

module.exports =  categoryModel