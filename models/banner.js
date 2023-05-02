const mongoose=require('mongoose')

const bannerSchema = mongoose.Schema({

    image : {
        type : Array,
        require : true
    },
    title :{
        type :String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    flag : {
        type : Number,
        default : 0
    }
    
})

module.exports = mongoose.model('banner',bannerSchema)








